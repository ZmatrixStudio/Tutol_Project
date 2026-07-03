package com.tutoroo.backend.service;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import redis.clients.jedis.Jedis;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class RedisOtpService {
    private final Jedis jedis;

    public RedisOtpService(@Value("${redis.url}") String redisUrl) {
        this.jedis = new Jedis(URI.create(redisUrl));
    }

    public String createOtp(String email, String otp, String purpose, Integer expire){
        try {
            String otpToken = UUID.randomUUID().toString();
            String key = "otp:" + email;
            String lockKey = "otp_lock:" + email;
            
            if (jedis.exists(lockKey)) {
                return "Vui lòng đợi 60 giây để gửi lại OTP";
            }

            jedis.setex(lockKey, 60, "1");

            Map<String, String> data = new HashMap<>();
            data.put("otpToken", otpToken);
            data.put("otpHash", BCrypt.hashpw(otp, BCrypt.gensalt()));
            data.put("attempts", "0");
            data.put("purpose", purpose);
            data.put("createdAt", String.valueOf(System.currentTimeMillis()));

            jedis.hset(key, data);
            jedis.expire(key, expire);
            
            return otpToken;
        } catch (Exception e) {
            System.out.print(e.getMessage());
            return e.getMessage();
        }
        
    } 

    public boolean verifyOtp(String email, String otpInput, String  purpose, String stateUUID){
        try {
            String otpKey = "otp:" + email;
            if (!jedis.exists(otpKey)) return false;

            Map<String, String> data = jedis.hgetAll(otpKey);

            String otpHash = data.get("otpHash");
            String storedPurpose = data.get("purpose");
            int attempts = Integer.parseInt(data.getOrDefault("attempts", "0"));

            if (!storedPurpose.equals(purpose)) return false;

            if (attempts >= 5) {
                jedis.del(otpKey);
                return false;
            }

            boolean valid = BCrypt.checkpw(otpInput, otpHash);
            if (!valid) {
                jedis.hincrBy(otpKey, "attempts", 1);
                return false;
            }

            jedis.del(otpKey);
            return true;
        } catch (Exception e) {
            System.out.print(e.getMessage());
            return false;
        }
       
    }
}
