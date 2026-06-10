package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.demo.repository.TaiKhoanRepository;

@SpringBootApplication
@EnableScheduling
public class TutolApplication {

	public static void main(String[] args) {
		SpringApplication.run(TutolApplication.class, args);
	}

	@Bean
	public CommandLineRunner testConnect(TaiKhoanRepository accountRepository){
		return args -> {
			System.out.println("Check Connect Database");

			try {
				System.out.println("KHÔNG LỖI");
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		};
	}

}

