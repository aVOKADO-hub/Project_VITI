package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.signals.Signal;
import dep22.mitit_duty_auto.service.SignalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3000/admin"})
@RequestMapping("/api/signals")
public class SignalController {

    private final SignalService signalService;

    @Autowired
    public SignalController(SignalService signalService) {
        this.signalService = signalService;
    }

    @GetMapping
    public List<Signal> getAllSignals() {
        return signalService.getAllSignals();
    }

    @GetMapping("/{id}")
    public Signal getSignal(@PathVariable int id) {
        return signalService.getSignalById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSignal(@PathVariable int id) {
        signalService.deleteSignal(id);
    }

    @PostMapping
    public Signal createSignal(@RequestBody Signal signal) {
        System.out.println("Received signal: " + signal); // Log the signal
        return signalService.saveSignal(signal);
    }
}
