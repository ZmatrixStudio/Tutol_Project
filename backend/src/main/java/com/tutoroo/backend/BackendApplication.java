package com.tutoroo.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner testDb(JdbcTemplate jdbcTemplate) {
        return args -> {
            String db = jdbcTemplate.queryForObject(
                    "SELECT current_database()",
                    String.class
            );
            System.out.println("=".repeat(30) + " START " + "=".repeat(30));
            System.out.println("[LOD] => Connected Success Name: " + db);
        };
    }
}