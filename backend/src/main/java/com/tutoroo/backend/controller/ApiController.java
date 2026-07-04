package com.tutoroo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tutoroo.backend.dto.ForgotDto;
import com.tutoroo.backend.dto.IdentifierDto;
import com.tutoroo.backend.dto.IdentifierEmailDto;
import com.tutoroo.backend.dto.RegisterDto;
import com.tutoroo.backend.service.ForgotService;
import com.tutoroo.backend.service.IdentifierEmailService;
import com.tutoroo.backend.service.IdentifierService;
import com.tutoroo.backend.service.RegisterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ApiController {

    private final IdentifierService identifierService;
    private final RegisterService registerService;
    private final IdentifierEmailService identifierEmailService;
    private final ForgotService forgotService;

    @PostMapping("/auth/identifier")
    public ResponseEntity<?> identifierEmail( @Valid @RequestBody IdentifierDto dto) {
        return identifierService.sendOtp(dto.getEmail(), dto.getPurpose());
    }

    @PostMapping("/auth/email-identifier")
    public ResponseEntity<?> identifierEmailVeri(@Valid @RequestBody IdentifierEmailDto dto){
        return identifierEmailService.verifyOtp(dto);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto dto){
        return registerService.Register(dto);
    } 

    @PostMapping("/auth/forgot")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotDto dto){
        return forgotService.Forgot(dto);
    } 

}