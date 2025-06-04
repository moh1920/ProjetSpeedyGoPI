package speedy.go.speedygo.configuration;

import jakarta.persistence.EntityManagerFactory;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import speedy.go.speedygo.models.Rental;
import speedy.go.speedygo.stationManagement.repository.RentalRepository;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class batchSpringConfig {
    @Bean
    public JpaPagingItemReader<Rental> rentalReader(EntityManagerFactory emf) {
        JpaPagingItemReader<Rental> reader = new JpaPagingItemReader<>();
        reader.setEntityManagerFactory(emf);
        reader.setQueryString("SELECT r FROM Rental r WHERE r.endTime <= :dateLimit");

        Map<String, Object> params = new HashMap<>();
        params.put("dateLimit", LocalDateTime.now().minusYears(1));
        reader.setParameterValues(params);
        reader.setPageSize(10);
        return reader;
    }
    @Bean
    public ItemWriter<Rental> rentalExcelWriter(RentalRepository rentalRepository) {
        return rentals -> {
            String directoryPath = "C:\\Users\\Adminn\\Desktop\\PI";
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = directoryPath + File.separator + "archived_rentals_" + LocalDateTime.now().toLocalDate() + ".xlsx";
            File excelFile = new File(fileName);

            Workbook workbook;
            Sheet sheet;
            int rowIdx = 0;

            // Si le fichier existe, l'ouvrir et récupérer la feuille et la dernière ligne
            if (excelFile.exists()) {
                try (FileInputStream fis = new FileInputStream(excelFile)) {
                    workbook = new XSSFWorkbook(fis);
                    sheet = workbook.getSheetAt(0);
                    rowIdx = sheet.getLastRowNum() + 1; // Commencer à la ligne suivante
                }
            } else {
                // Sinon, créer un nouveau fichier et ajouter les en-têtes
                workbook = new XSSFWorkbook();
                sheet = workbook.createSheet("Archived Rentals");

                Row header = sheet.createRow(rowIdx++);
                header.createCell(0).setCellValue("ID");
                header.createCell(1).setCellValue("Start Time");
                header.createCell(2).setCellValue("End Time");
                header.createCell(3).setCellValue("Cost");
                header.createCell(4).setCellValue("Distance");
                header.createCell(4).setCellValue("customer");
                header.createCell(4).setCellValue("startingPoint");
                header.createCell(4).setCellValue("destination");
            }

            // Ajouter les nouvelles lignes
            for (Rental r : rentals) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.getId());
                row.createCell(1).setCellValue(r.getStartTime().toString());
                row.createCell(2).setCellValue(r.getEndTime().toString());
                row.createCell(3).setCellValue(r.getCost());
                row.createCell(4).setCellValue(r.getDistanceTraveled());
                row.createCell(4).setCellValue(r.getCustomer().getEmail());
                row.createCell(4).setCellValue(r.getStartingPoint().getLocation());
                row.createCell(4).setCellValue(r.getDestination().getLocation());
            }

            // Sauvegarder le fichier
            try (FileOutputStream fos = new FileOutputStream(fileName)) {
                workbook.write(fos);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de la sauvegarde du fichier Excel", e);
            } finally {
                try {
                    workbook.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            // Supprimer les données archivées
            rentalRepository.deleteAll(rentals);
        };
    }



    @Bean
    public Step archiveStep(JobRepository jobRepository,
                            PlatformTransactionManager transactionManager,
                            ItemReader<Rental> reader,
                            ItemWriter<Rental> writer) {

        return new StepBuilder("archiveStep", jobRepository)
                .<Rental, Rental>chunk(10, transactionManager)
                .reader(reader)
                .writer(writer)
                .build();
    }

    @Bean
    public Job archiveRentalJob(JobRepository jobRepository, Step archiveStep) {
        return new JobBuilder("archiveRentalJob", jobRepository)
                .start(archiveStep)
                .build();
    }


}
