package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.report.ListReport;
import dep22.mitit_duty_auto.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping()
    public List<ListReport> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/{id}")
    public ListReport getReportById(@PathVariable int id) {
        return reportService.getReportById(id);
    }

    @PostMapping()
    public ListReport addReport(@RequestBody ListReport report) {
        return reportService.saveReport(report);
    }

    @DeleteMapping("/{id}")
    public void deleteReportById(@PathVariable int id) {
        reportService.deleteReportById(id);
    }
}
