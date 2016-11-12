import React from 'react';
import './About.css';

class About extends React.Component {
    getContributorsList() {
        const contributors = ['Plastkuken', 'Lerp', 'Dicky', 'Mr Mats'];
        const contributorList = contributors.map(contributor =>
                <li className="contributor">{contributor}</li>
        );
        return contributorList;
    }

    render() {
        return (
            <div className="contributors">
                <ul>{this.getContributorsList()}</ul>
            </div>
        );
    }
}

export default About
