package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.schedule.notes.Event;
import dep22.mitit_duty_auto.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping()
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    @GetMapping("/{id}/time")
    public String getEventTime(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        LocalTime time = LocalTime.parse(event.getEventTime());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return time.format(formatter);
    }

    @PostMapping()
    public Event addEvent(@RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEventById(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
