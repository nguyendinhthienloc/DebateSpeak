package org.debatespeak.authify.controller;

import org.debatespeak.authify.dto.RoomRequests;
import org.debatespeak.authify.dto.RoomResponses;
import org.debatespeak.authify.entity.UserEntity;
import org.debatespeak.authify.service.AuthService;
import org.debatespeak.authify.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class RoomController {
    private final AuthService auth; private final RoomService rooms;
    public RoomController(AuthService auth, RoomService rooms) { this.auth=auth; this.rooms=rooms; }
    private UserEntity current(String header) { return auth.requireCurrentUser(header); }
    @GetMapping("/topics") public RoomResponses.Topics topics(@RequestHeader(value="Authorization",required=false) String header){current(header);return rooms.listTopics();}
    @PostMapping("/rooms") @ResponseStatus(HttpStatus.CREATED) public RoomResponses.Snapshot create(@RequestHeader(value="Authorization",required=false) String header,@RequestBody RoomRequests.Create request){return rooms.create(current(header),request);}
    @PostMapping("/rooms/lookup") public RoomResponses.Preview lookup(@RequestHeader(value="Authorization",required=false) String header,@RequestBody RoomRequests.Code request){return rooms.lookup(current(header),request==null?null:request.code());}
    @PostMapping("/rooms/join") public RoomResponses.Snapshot join(@RequestHeader(value="Authorization",required=false) String header,@RequestBody RoomRequests.Code request){return rooms.join(current(header),request==null?null:request.code());}
    @GetMapping("/rooms/{id}") public RoomResponses.Snapshot get(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id){return rooms.get(current(header),id);}
    @PostMapping("/rooms/{id}/cancel") public RoomResponses.Snapshot cancel(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id){return rooms.cancel(current(header),id);}
    @PostMapping("/rooms/{id}/leave") public RoomResponses.Snapshot leave(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id){return rooms.leave(current(header),id);}
    @PutMapping("/rooms/{id}/ready") public RoomResponses.Snapshot ready(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id,@RequestBody RoomRequests.Ready request){return rooms.ready(current(header),id,request);}
    @DeleteMapping("/rooms/{id}/ready") public RoomResponses.Snapshot unready(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id){return rooms.unready(current(header),id);}
    @PostMapping("/rooms/{id}/end") public RoomResponses.Snapshot end(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id,@RequestBody RoomRequests.End request){return rooms.end(current(header),id,request);}
    @PostMapping("/rooms/{id}/token") public RoomResponses.LiveKit token(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id){return rooms.token(current(header),id);}
    @PostMapping("/rooms/{id}/turns") public RoomResponses.Turn turn(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id,@RequestBody RoomRequests.Turn request){return rooms.turn(current(header),id,request);}
    @GetMapping("/rooms/{id}/turns") public RoomResponses.Turns turns(@RequestHeader(value="Authorization",required=false) String header,@PathVariable UUID id,@RequestParam(defaultValue="0") long after){return rooms.turns(current(header),id,after);}
}
