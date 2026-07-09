package com.tutoroo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tutoroo.backend.dto.ForgotDto;
import com.tutoroo.backend.dto.IdentifierDto;
import com.tutoroo.backend.dto.IdentifierEmailDto;
import com.tutoroo.backend.dto.LoginDto;
import com.tutoroo.backend.dto.RegisterDto;
import com.tutoroo.backend.service.ForgotService;
import com.tutoroo.backend.service.IdentifierEmailService;
import com.tutoroo.backend.service.IdentifierService;
import com.tutoroo.backend.service.LoginService;
import com.tutoroo.backend.service.LogoutService;
import com.tutoroo.backend.service.RegisterService;
import com.tutoroo.backend.service.SessionRenewService;

import jakarta.servlet.http.HttpServletRequest;
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
    private final LoginService loginService;
    private final SessionRenewService sessionRenewService;
    public final LogoutService logoutService;
    
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

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto dto) throws Exception {
        return loginService.Login(dto);
    }

    @PostMapping("/auth/session-renew")
    public ResponseEntity<?> sessionRenew(HttpServletRequest headers){
        return sessionRenewService.getSessionNew(headers);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest headers){
        return logoutService.Logout(headers);
    }

}