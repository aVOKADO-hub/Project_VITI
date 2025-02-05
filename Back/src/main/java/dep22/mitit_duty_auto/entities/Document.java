package dep22.mitit_duty_auto.entities;

import dep22.mitit_duty_auto.entities.enums.TypeOfDockument;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

public class Document {
    @Setter
    @Getter
    private int id;
    @Setter
    @Getter
    private String title;
    @Setter
    @Getter
    private TypeOfDockument typeOfDockument;
    @Setter
    @Getter
    private String path;
    @Setter
    @Getter
    private boolean isRead;
    @Setter
    @Getter
    private Date sendDate;
    @Setter
    @Getter
    private Date readDate;
    @Setter
    @Getter
    private String createBy;
    @Setter
    @Getter
    private String sendTo;

    public Document(int id, String title, TypeOfDockument typeOfDockument, String path,
                    boolean isRead, Date sendDate, Date readDate, String createBy, String sendTo) {
        this.id = id;
        this.title = title;
        this.typeOfDockument = typeOfDockument;
        this.path = path;
        this.isRead = isRead;
        this.sendDate = sendDate;
        this.readDate = readDate;
        this.createBy = createBy;
        this.sendTo = sendTo;
    }



    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", typeOfDockument=" + typeOfDockument +
                ", path='" + path + '\'' +
                ", isRead=" + isRead +
                ", sendDate=" + sendDate +
                ", readDate=" + readDate +
                ", createBy='" + createBy + '\'' +
                ", sendTo='" + sendTo + '\'' +
                '}';
    }
}

//-id
//-TypeOfDockument
//-Path
//-isRead
//-SendDate
//-ReadDate
//-CreateBy
//-SendTo

