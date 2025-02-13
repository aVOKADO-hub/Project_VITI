import React from "react";

const Sidebar = ({ toggleModal }) => {
    return (
        <aside className="sidebar">
            {/* Іконка для відкриття модального вікна документів */}
            <div className="icon documents" onClick={toggleModal} title="Документи">
                <img src={require('../img/docs.png')} alt="Docs-menu" style={{ width: "30px" }} />
            </div>

            {/* Додаткові іконки для інших інструментів у майбутньому */}
            <div className="icon" title="Інший інструмент">
                <img src={require('../img/tools.png')} alt="Other-tool" style={{ width: "30px" }} />
            </div>
        </aside>
    );
};

export default Sidebar;
