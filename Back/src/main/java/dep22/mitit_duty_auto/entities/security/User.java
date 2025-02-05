package dep22.mitit_duty_auto.entities.security;

import dep22.mitit_duty_auto.entities.Duty;

public class User {
    private int id;
    private String name;
    private Roles role;
    private String password;
    private Duty duty;

    public User(int id, String name, Roles role, String password, Duty duty) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.password = password;
        this.duty = duty;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Duty getDuty() {
        return duty;
    }

    public void setDuty(Duty duty) {
        this.duty = duty;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", role=" + role +
                ", password='" + password + '\'' +
                ", duty=" + duty +
                '}';
    }
}
