package org.debatespeak.authify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableJpaRepositories(basePackages = "org.debatespeak.authify.repository")
@EntityScan(basePackages = "org.debatespeak.authify.entity")
public class AuthifyApplication {
	public static void main(String[] args) {
		SpringApplication.run(AuthifyApplication.class, args);
	}
}