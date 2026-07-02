package com.tutoroo.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tutoroo.backend.dto.IdentifierDto;
import com.tutoroo.backend.dto.RegisterDto;
import com.tutoroo.backend.service.IdentifierService;
import com.tutoroo.backend.service.RegisterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ApiController {

    private final IdentifierService identifierService;

    @Autowired
    private RegisterService registerService;

    @PostMapping("/auth/identifier")
    public ResponseEntity<?> identifierEmail( @Valid @RequestBody IdentifierDto dto) {
        return identifierService.sendOtp(dto.getEmail(), dto.getPurpose());
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto dto){
        return registerService.Register(dto);
    }
}