package com.tutoroo.backend.configs;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Configuration
public class RedisConfig {

    @Bean
    public JedisPool jedisPool(@Value("${redis.url}") String redisUrl) {

        JedisPoolConfig config = new JedisPoolConfig();

        config.setMaxTotal(20);
        config.setMaxIdle(10);
        config.setMinIdle(2);

        config.setTestOnBorrow(true);
        config.setTestWhileIdle(true);

        return new JedisPool(config, URI.create(redisUrl));
    }
}