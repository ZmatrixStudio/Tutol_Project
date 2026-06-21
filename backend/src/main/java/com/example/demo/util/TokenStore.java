package com.example.demo.util;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class TokenStore {

    private static final Set<String> usedTokens = ConcurrentHashMap.newKeySet();

    public static boolean isUsed(String token) {
        return usedTokens.contains(token);
    }

    public static void markUsed(String token) {
        usedTokens.add(token);
    }
}