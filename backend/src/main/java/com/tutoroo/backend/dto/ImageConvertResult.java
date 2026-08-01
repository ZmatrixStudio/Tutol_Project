package com.tutoroo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageConvertResult {

    private boolean success;

    private byte[] data;

    private String message;
}