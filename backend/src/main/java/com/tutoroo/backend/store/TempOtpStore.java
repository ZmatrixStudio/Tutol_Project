package com.tutoroo.backend.store;

import java.util.concurrent.ConcurrentHashMap;

import com.tutoroo.backend.model.TempOtpData;

public class TempOtpStore {
    private static final ConcurrentHashMap<String, TempOtpData> DATA = new ConcurrentHashMap<>();

    public static void save(String email, TempOtpData data) {
        DATA.put(email, data);
    }

    public static TempOtpData get(String email) {
        return DATA.get(email);
    }

    public static void remove(String email) {
        DATA.remove(email);
    }
}
