package dep22.mitit_duty_auto.repos;

import dep22.mitit_duty_auto.entities.Document;
import dep22.mitit_duty_auto.entities.security.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {

    @Query("SELECT d FROM Document d WHERE d.sendTo = :sendToName")
    List<Document> findBySendToName(@Param("sendToName") String sendToName);

    default List<Document> findBySendTo(Roles sendTo) {
        return findBySendToName(sendTo.name());
    }
}
