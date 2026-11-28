package org.debatespeak.authify.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
public final class RoomRequests { private RoomRequests(){} public record Create(String topic_id, String format, Integer duration_minutes, String side){} public record Code(String code){} public record Ready(boolean consent, String input){} public record End(String reason){} public record Turn(String text){} }
