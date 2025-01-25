package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.instruction.Instruction;
import dep22.mitit_duty_auto.service.InstructionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/instructions")
public class InstructionController {

    private final InstructionService instructionService;

    @Autowired
    public InstructionController(InstructionService instructionService) {
        this.instructionService = instructionService;
    }

    @GetMapping
    public List<Instruction> getAllInstructions() {
        return instructionService.getAllInstructions();
    }

    @GetMapping("/{id}")
    public Instruction getInstructionById(@PathVariable int id) {
        return instructionService.getInstructionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteInstruction(@PathVariable int id) {
        instructionService.deleteInstruction(id);
    }

    @PostMapping
    public Instruction addInstruction(@RequestBody Instruction instruction) {
        return instructionService.saveInstruction(instruction);
    }
}
