package com.tutoroo.backend.service;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import com.fasterxml.jackson.databind.JsonNode;
import com.tutoroo.backend.dto.ImageConvertResult;
import com.tutoroo.backend.dto.UploadFileDto;
import com.tutoroo.backend.entity.TepDinhKem;
import com.tutoroo.backend.enums.OwnerType;
import com.tutoroo.backend.enums.StorageProvider;
import com.tutoroo.backend.repository.TepDinhKemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UploadFileService {

    @Value("${telegram.bot.token}")
    private String BOT_TOKEN;

    @Value("${telegram.storage.chat-id}")
    private Long CHAT_ID;

    private final ImageConvertService imageConvertService;
    private final ObjectMapper objectMapper;
    private final TepDinhKemRepository tepDinhKemRepository;

    public ResponseEntity<?> upload(UploadFileDto dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Long)) { return ResponseEntity.status(401).body(Map.of("status", 401, "success", false,"message", "Unauthorized" ));}
        Long userId = (Long) authentication.getPrincipal();
        
        MultipartFile file = dto.getFile();

        if (file.getSize() >= 20 * 1024 * 1024) {
            return ResponseEntity.status(413).body(Map.of("status", 413, "error", true, "success", false, "message", "Vui lòng up File nhỏ hơn 20MB"));
        }


        String contentType = file.getContentType();
        boolean isImage = "image/jpeg".equals(contentType) || "image/png".equals(contentType) || "image/webp".equals(contentType);
        
        if (contentType != null && isImage){
            ImageConvertResult result = imageConvertService.convertToWebP(file);
            if (!result.isSuccess()) return ResponseEntity.status(415).body(Map.of("status", 415, "error", true, "success", false, "message", result.getMessage()));
            
            byte[] uploadData = result.getData();

            String fileName = file.getOriginalFilename() + "_" + UUID.randomUUID().toString().replace("-", "") + ".webp";
            String mimeType = "image/webp";

            // Upload lên telegram
            try {
                System.out.println("BOT_TOKEN = " + BOT_TOKEN);
                System.out.println("CHAT_ID = " + CHAT_ID);
                URI uri = URI.create("https://api.telegram.org/bot" + BOT_TOKEN + "/sendDocument");

                String boundary = "----Tutoroo" + System.currentTimeMillis();

                HttpURLConnection conn =(HttpURLConnection) uri.toURL().openConnection();

                conn.setDoOutput(true);
                conn.setRequestMethod("POST");

                conn.setRequestProperty(
                        "Content-Type",
                        "multipart/form-data; boundary=" + boundary
                );

                try (OutputStream os = conn.getOutputStream();
                    PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8), true)) {

                    // chat_id
                    writer.append("--").append(boundary).append("\r\n");
                    writer.append("Content-Disposition: form-data; name=\"chat_id\"\r\n\r\n");
                    writer.append(CHAT_ID.toString()).append("\r\n");
                    writer.flush();

                    // document
                    writer.append("--").append(boundary).append("\r\n");
                    writer.append("Content-Disposition: form-data; name=\"document\"; filename=\"").append(fileName).append("\"\r\n");
                    writer.append("Content-Type: ").append(mimeType).append("\r\n\r\n");

                    writer.flush();

                    os.write(uploadData);
                    os.flush();

                    writer.append("\r\n");
                    writer.append("--").append(boundary).append("--").append("\r\n");
                    writer.flush();
                }

                int code = conn.getResponseCode();

                InputStream is = code >= 400? conn.getErrorStream() : conn.getInputStream();

                String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                System.out.println(response);

                try {
                    JsonNode root = objectMapper.readTree(response);
                    boolean ok = root.path("ok").asBoolean(false);
                    if (!ok) return ResponseEntity.status(500).body(Map.of("status", 500, "message", "Upload File thất bại !!"));
                    
                    JsonNode resultTelegram = root.path("result");
                    JsonNode sticker = resultTelegram.path("sticker");

                    Long messageId = resultTelegram.path("message_id").asLong();
                    Long chatId = resultTelegram.path("chat").path("id").asLong();

                    String fileId = sticker.path("file_id").asText();
                    Long fileSize = sticker.path("file_size").asLong();
                    System.out.println("messageId = " + messageId);
                    System.out.println("chatId = " + chatId);
                    System.out.println("fileId = " + fileId);
                    System.out.println("fileSize = " + fileSize);

                    TepDinhKem tepDinhKem = TepDinhKem.builder()
                        .ownerType(OwnerType.UPLOAD_TEMP)
                        .ownerId(null)
                        .storageProvider(StorageProvider.TELEGRAM)
                        .storageKey(fileId)
                        .messageId(messageId)
                        .chatId(chatId)
                        .fileName(fileName)
                        .mimeType(mimeType)
                        .fileSize(fileSize)
                        .uploadedBy(userId)
                        .createdAt(LocalDateTime.now())
                        .build();
                    tepDinhKem = tepDinhKemRepository.save(tepDinhKem);

                    return ResponseEntity.status(200).body(Map.of("status", 200, "success", true, "error", false, "message", "Upload File Done!", "data", Map.of("id", tepDinhKem.getId(), "file_size", fileSize, "url", "/cdn/files/"+tepDinhKem.getId(), "file_name", fileName)));

                } catch (Exception e) {
                    System.out.println("[UPLOAD FILE] => " + e.getMessage());
                    return ResponseEntity.status(500).body(Map.of("status", 500, "message", "Upload File False !!"));
                }

            } catch (Exception e) {
                return ResponseEntity.status(500).body(e.getMessage());

            }
            
        } 
        //else {
        //     byte[] uploadData = file.getBytes();
        // }
        return ResponseEntity.status(200).body("done");

    }

    public ResponseEntity<?> delete(UUID  id ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Long)) { return ResponseEntity.status(401).body(Map.of("status", 401, "success", false,"message", "Unauthorized" ));}
        Long userId = (Long) authentication.getPrincipal();

        TepDinhKem tepDinhKem = tepDinhKemRepository.findByIdAndUploadedBy(id, userId).orElse(null);
        if (tepDinhKem == null) { return ResponseEntity.status(404).body(Map.of("status", 404, "success", false,"message", "File Not Found" ));}

        tepDinhKemRepository.delete(tepDinhKem);

        return ResponseEntity.status(200).body(Map.of("status", 200, "success", true, "message", "Xóa FILE Thành Công"));
    }
}
