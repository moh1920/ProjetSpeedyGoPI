package speedy.go.speedygo.stationManagement.controller;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gestionStation/maintenance")
public class BatchController {
    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job archiveJob;

    @GetMapping("/run-archive-job")
    public String runArchiveJob() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(archiveJob, params);
        return "Archive job lancé !";
    }
}
