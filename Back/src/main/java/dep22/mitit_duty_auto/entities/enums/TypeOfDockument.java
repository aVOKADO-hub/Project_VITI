package dep22.mitit_duty_auto.entities.enums;

import lombok.Getter;

@Getter
public enum TypeOfDockument {
    PERSONNEL_EXPENDITURE("Розхід"),
    DAILY_ORDER("Добовий наказ");

    private final String name;

    TypeOfDockument(String name) {
        this.name = name;
    }

}
