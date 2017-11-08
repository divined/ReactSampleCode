import React from 'react';
import pluralize from 'pluralize';
import { connect } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import { getCruLabel, getNatureLabel, getDeadlineStatusLabel } from '../../Global/MhpDrupal';
import Checkboxes from '../../Global/Forms/CheckboxesFilter';
import DatePicker from 'react-datepicker';

/**
 * DatePicker widget.
 */
export class DatePickerWidget extends React.Component {
  render() {
    return <div>
      <div className="date">
        <input className="datepicker" type="text" value={this.props.value} onClick={this.props.onClick}/>
        <span className="ico edit-date" onClick={this.props.onClick}>
          <svg className="svg-ico">
            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#ico-edit" />
          </svg>
        </span>
      </div>
    </div>
  }
}

@connect(store => ({ filters: store.Deadlines.filters, count: store.Deadlines.count, form: store.DeadlineForms.filters }))
export default class Filters extends React.Component {

  /**
   * Change date handler
   *
   * @param date
   */
  dateHandleChange = (date) => {
    this.props.dispatch(actions.change('DeadlineForms.filters.created', date && date.isValid() ? date : null));
  };

  /**
   * {@inheritDoc}
   */
  render() {
    const { count, submitFilters, form, filters } = this.props;
    const deadlineCount = pluralize('demande', count, true);

    return (
      <div className="filters-block">
        <Form model="DeadlineForms.filters" onSubmit={ submitFilters }>

          <div className="row">
            <strong className="ttl">Date</strong>
            <ul>
              <li>
                <DatePicker
                  selected={form.created}
                  onChange={this.dateHandleChange}
                  customInput={<DatePickerWidget />}
                  isClearable={true}
                  locale="fr"
                />
              </li>
            </ul>
          </div>

          <Checkboxes
            itemsLabel={ getNatureLabel }
            items={ filters.field_mhp_deadline_contract }
            model=".field_mhp_deadline_contract"
            name="field_mhp_deadline_contract"
            label="Type de contrat"
          />

          <Checkboxes
            itemsLabel={ getCruLabel }
            items={ filters.field_mhp_deadline_cru }
            model=".field_mhp_deadline_cru"
            name="field_mhp_deadline_cru"
            label="Cru"
          />

          <div className="row">
            <strong className="ttl">
              Année de Récolte
              <div className="info">
                <span className="ico"><svg className="svg-ico"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#ico-info" /></svg></span>
                <div className="drop">
                  <p>Merci de sélectioner une deuxième année supérieure ou égale à la première</p>
                </div>
              </div>
            </strong>
            <ul>
              <li>
                <label className="hidden">harvest year</label>
                <Control.select className="custom-select" model=".field_mhp_deadline_harvest:from" updateOn="change">
                  <option value="null" />
                  {filters.field_mhp_deadline_harvest && filters.field_mhp_deadline_harvest.map((item, key) => {
                    return <option key={key} value={item}>{item}</option>
                  })}
                </Control.select>
              </li>
              <li>
                <label className="hidden">harvest year</label>
                <Control.select className="custom-select" model=".field_mhp_deadline_harvest:to" updateOn="change">
                  <option value="null" />
                  {filters.field_mhp_deadline_harvest && filters.field_mhp_deadline_harvest.map((item, key) => {
                    return <option key={key} value={item}>{item}</option>
                  })}
                </Control.select>
              </li>
            </ul>
          </div>

          <div className="row">
            <strong className="ttl">Numéro</strong>
            <ul>
              <li>
                <label className="hidden">Contract number</label>
                <Control.text model=".field_mhp_deadline_contract_num" updateOn="change" placeholder="Contract number"/>
              </li>
            </ul>
          </div>

          <div className="row">
            <strong className="ttl">Raison Sociale</strong>
            <ul>
              <li>
                <label className="hidden">Raison Sociale</label>
                <Control.text model=".field_mhp_deadline_corp_name" updateOn="change" placeholder="Raison Sociale"/>
              </li>
            </ul>
          </div>

          <Checkboxes
            itemsLabel={ getDeadlineStatusLabel }
            items={ filters.field_mhp_deadline_status }
            model=".field_mhp_deadline_status"
            name="field_mhp_deadline_status"
            label="Statut"
          />

          <div className="controls form-actions">
            <div className="holder">
              <span className="result-txt">{ deadlineCount }</span>
              <button className="btn-filter active">
                <center>VALIDER</center>
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
