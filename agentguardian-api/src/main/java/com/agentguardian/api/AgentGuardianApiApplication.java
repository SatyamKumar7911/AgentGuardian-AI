package com.agentguardian.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AgentGuardianApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgentGuardianApiApplication.class, args);
	}

}
