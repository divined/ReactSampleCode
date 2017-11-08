import React from 'react';
import { getCruLabel, getNatureLabel } from '../../Global/MhpDrupal';

/**
 * CheckNewDeadlineSidebar class.
 */
export default class CheckNewDeadlineSidebar extends React.Component {

  /**
   * {@inheritDoc}
   */
  render = () => {
    const { active, toggleChange, toggleDelete } = this.props;
    let field_mhp_deadline_initiale = active.field_mhp_deadline_initiale ? `T${active.field_mhp_deadline_initiale}` : '';

    return (
      <div>
        <div className="head">
          <a className="btn-back" href="#">
            <span className="ico">
              <svg className="svg-ico">
                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#ico-back" />
              </svg>
            </span>RETOUR
          </a>
          <h2>DETAIL</h2>
        </div>
        <div className="detail-table">
          <table>
            <tbody>
            <tr>
              <td>Type de  contrat</td>
              <td>{getNatureLabel(active.field_mhp_deadline_contract)}</td>
            </tr>
            <tr>
              <td>Cru</td>
              <td>{getCruLabel(active.field_mhp_deadline_cru)}</td>
            </tr>
            <tr>
              <td>Année de Récolte</td>
              <td>{active.field_mhp_deadline_harvest}</td>
            </tr>
            <tr>
              <td>Numéro de Contrat</td>
              <td>№{active.field_mhp_deadline_contract_num}</td>
            </tr>
            <tr>
              <td>Raison sociale</td>
              <td>{active.field_mhp_deadline_corp_name}</td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <td>Date de livraison initiale</td>
              <td>{field_mhp_deadline_initiale}</td>
            </tr>
            <tr>
              <td>Date de livraison souhaitée</td>
              <td>{active.field_mhp_deadline_souhaitee}</td>
            </tr>
            </tbody>
          </table>
          <div className="actions-wrapper">
            <a className="btn" onClick={toggleChange}>Traiter</a>
            <a className="btn" onClick={toggleDelete}>SUPPRIMER</a>
          </div>
        </div>
      </div>
    );
  }
}
