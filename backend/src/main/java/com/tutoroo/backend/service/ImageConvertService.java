package com.tutoroo.backend.service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tutoroo.backend.dto.ImageConvertResult;

@Service
public class ImageConvertService {

    public ImageConvertResult convertToWebP(MultipartFile file) {

        try {

            BufferedImage image = ImageIO.read(file.getInputStream());

            if (image == null) {
                return new ImageConvertResult(
                        false,
                        null,
                        "Ảnh không hợp lệ"
                );
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            Iterator<ImageWriter> writers =
                    ImageIO.getImageWritersByMIMEType("image/webp");

            if (!writers.hasNext()) {
                return new ImageConvertResult(
                        false,
                        null,
                        "Server không hỗ trợ WebP"
                );
            }

            ImageWriter writer = writers.next();

            try (ImageOutputStream ios =
                         ImageIO.createImageOutputStream(baos)) {

                writer.setOutput(ios);

                ImageWriteParam param = writer.getDefaultWriteParam();

                if (param.canWriteCompressed()) {
                    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);

                    String[] compressionTypes = param.getCompressionTypes();

                    if (compressionTypes != null && compressionTypes.length > 0) {
                        param.setCompressionType(compressionTypes[0]);
                    }

                    param.setCompressionQuality(0.8f);
                }

                writer.write(null, new IIOImage(image, null, null), param);

            } finally {
                writer.dispose();
            }

            return new ImageConvertResult(
                    true,
                    baos.toByteArray(),
                    null
            );

        } catch (IOException e) {

            return new ImageConvertResult(
                    false,
                    null,
                    "Không thể đọc ảnh"
            );
        }
    }
}