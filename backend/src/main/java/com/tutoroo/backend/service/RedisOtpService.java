package com.tutoroo.backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

@Service
public class RedisOtpService {

    private final JedisPool jedisPool;

    public RedisOtpService(JedisPool jedisPool) {
        this.jedisPool = jedisPool;
    }

    public String createOtp(String email, String otp, String purpose, Integer expire) {

        try (Jedis jedis = jedisPool.getResource()) {

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
            e.printStackTrace();
            throw new RuntimeException("Redis createOtp failed", e);
        }
    }

    public boolean verifyOtp(String email, String otpInput, String purpose, String stateUUID) {

        try (Jedis jedis = jedisPool.getResource()) {

            String otpKey = "otp:" + email;

            if (!jedis.exists(otpKey)) {
                return false;
            }

            Map<String, String> data = jedis.hgetAll(otpKey);

            if (data.isEmpty()) {
                return false;
            }

            String otpHash = data.get("otpHash");
            String storedPurpose = data.get("purpose");

            if (otpHash == null || storedPurpose == null) {
                return false;
            }

            if (!purpose.equals(storedPurpose)) {
                return false;
            }

            int attempts = Integer.parseInt(data.getOrDefault("attempts", "0"));

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
            e.printStackTrace();
            return false;
        }
    }
}