package com.agentguardian.api.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/sse")
@CrossOrigin(origins = "*")
public class SseController {

    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/timeline/{investigationId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamTimeline(@PathVariable UUID investigationId) {
        SseEmitter emitter = new SseEmitter(60000L); // 60 seconds timeout
        emitters.put(investigationId, emitter);
        
        emitter.onCompletion(() -> emitters.remove(investigationId));
        emitter.onTimeout(() -> emitters.remove(investigationId));
        
        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to investigation " + investigationId));
        } catch (IOException e) {
            emitters.remove(investigationId);
        }
        
        return emitter;
    }

    public void sendEvent(UUID investigationId, Object data) {
        SseEmitter emitter = emitters.get(investigationId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("TIMELINE_UPDATE").data(data));
            } catch (IOException e) {
                emitters.remove(investigationId);
            }
        }
    }
}
