import React from 'react';
import { getProcessedCruLabel, getNatureLabel, getDeadlineStatusLabel } from '../../Global/MhpDrupal';
import Pager from '../../Global/Components/Pager';

/**
 * CheckNewDeadlineTable class.
 */
export default class CheckNewDeadlineTable extends React.Component {

  /**
   * {@inheritDoc}
   */
  render() {
    const { active, deadlines, forcePage, count, setActive, changePage } = this.props;

    return (
      <div className="content">
        <div className="block-table">
          <div className="winegrowers-table">
            <div className="table-holder">
              <div className="data-table">
                <table className="responsive">
                  <thead>
                  <tr>
                    <th className="first-col" onClick={ this.props.sort('created') }>Date</th>
                    <th onClick={ this.props.sort('field_mhp_deadline_contract') }>Type de<br /> contrat</th>
                    <th onClick={ this.props.sort('field_mhp_deadline_cru') }>Cru</th>
                    <th onClick={ this.props.sort('field_mhp_deadline_harvest') }>Année de<br /> Recolté</th>
                    <th onClick={ this.props.sort('field_mhp_deadline_contract_num') }>Numéro</th>
                    <th onClick={ this.props.sort('field_mhp_deadline_status') }>Statut</th>
                  </tr>
                  </thead>
                  <tbody>
                  {deadlines && deadlines.map(deadline => {
                    let className = active && deadline.id === active.id ? 'active' : '';

                    return <tr className={className} key={deadline.id} onClick={setActive.bind(this, deadline.id)}>
                      <td>{deadline.created}</td>
                      <td>{getNatureLabel(deadline.field_mhp_deadline_contract)}</td>
                      <td>{getProcessedCruLabel(deadline.field_mhp_deadline_cru)}</td>
                      <td>{deadline.field_mhp_deadline_harvest}</td>
                      <td>{deadline.field_mhp_deadline_contract_num}</td>
                      <td>{getDeadlineStatusLabel(deadline.field_mhp_deadline_status)}</td>
                    </tr>
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Pager forcePage={ forcePage } count={ count } changePage={ changePage } />
      </div>
    );
  }
}
