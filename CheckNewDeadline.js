import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Breadcrumb from '../../Global/Components/Breadcrumb';
import { VelocityTransitionGroup } from 'velocity-react';
import { MhpDrupal } from '../../Global/MhpDrupal';
import Filters from '../Components/Filters';
import { hashHistory } from 'react-router';
import api from '../../../Components/Global/restAPI';
import moment from 'moment';
import CheckNewDeadlineTable from "../Components/CheckNewDeadlineTable";
import CheckNewDeadlineSidebar from "../Components/CheckNewDeadlineSidebar";
import { actions } from 'react-redux-form';
import { Parser } from 'html-to-react';

const htmlToReactParser = new Parser();

/**
 * Status frame pure component
 *
 * @param props
 *   Inner props
 *
 * @constructor
 */
const AproveFrame = (props) => (
  <div className="block-feedback">
    <div className="container">
      <div className="frame">
        <div className="ico">
          <svg className="svg-ico"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#ico-done"></use></svg>
        </div>
        <div className="text end-contracts">
          <h3>{htmlToReactParser.parse(props.body)}</h3>
          <div className="popup-action">
            {props.valider && <input type="submit" className="btn" onClick={props.valider} value="Valider" />}
            {props.annuler && <input type="submit" className="cancel" onClick={props.annuler} value="Annuler"/>}
            {props.retour && <input type="submit" className="btn" onClick={props.retour} value="Retour"/>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * CheckNewDeadline class.
 */
@connect(store => ({Deadlines: store.Deadlines, filters: store.DeadlineForms.filters, User: store.User}))
export default class CheckNewDeadline extends React.Component {
  /**
   * {@inheritDoc}
   */
  constructor(props) {
    super(props);
    this.state = { open: false, change: false, delete: false, confirm: false };
  }

  /**
   * Clean redux state
   *
   * @returns {boolean}
   */
  clear = () => {
    this.props.dispatch({type: 'DEADLINE_CLEAR'});

    return true;
  };

  /**
   * Load deadlines by query
   *
   * @param query
   *    Query array
   *
   * @returns {boolean}
   */
  getDeadlines = (query) => {
    query = _.mapValues(query, (item, key) =>
      _.isObject(item) && !moment.isMoment(item) ? _.filter(_.keys(item), (i) => item[i] === true) :  item
    );

    this.props.dispatch(api.deadline.list(query)).then(deadlines => {
      if (this.props.params.id) {
        this.props.dispatch({type: 'DEADLINE_SET_ACTIVE', payload: _.filter(deadlines.data, (i) => i.id === this.props.params.id)[0]});
      }

      this.props.dispatch({type: 'DEADLINE_LOAD', payload: deadlines});
      this.setState({loaded: true});
    });

    return true;
  };

  /**
   * {@inheritDoc}
   */
  componentWillMount = () => this.props.dispatch(actions.reset('DeadlineForms.filters'));

  /**
   * {@inheritDoc}
   */
  componentWillUnmount = () => this.props.dispatch({type: 'DEADLINE_SET_ACTIVE', payload: null});

  /**
   * {@inheritDoc}
   */
  componentDidMount = () => {
    document.title = "Mes demandes de modification de date de livraison | Portail Partenaire";
    this.getDeadlines(this.props.filters);
    MhpDrupal.responsiveTable();
  };

  /**
   * Change page handler
   *
   * @param selected
   *   Page number.
   */
  changePage = ({selected}) => {
    this.props.dispatch(actions.change('DeadlineForms.filters.page', selected));
    this.getDeadlines(_.assign(_.clone(this.props.filters), { page: selected }));
    window.scrollTo(0, 0);
  };

  /**
   * Toggle visibility of change status frame
   *
   * @returns {boolean}
   */
  toggleChange = () => {
    this.setState({ change: !this.state.change });
    return true;
  };

  /**
   * Toggle visibility of delete status frame
   *
   * @returns {boolean}
   */
  toggleDelete = () => {
    this.setState({ delete: !this.state.delete });
    return true;
  };

  /**
   * Toggle visibility of filter form frame
   *
   * @param e
   */
  toggleFilter = (e) => {
    this.setState({ open: !this.state.open });
    e.preventDefault();
  };

  /**
   * Filter form submit handler
   *
   * @param filters
   *   Form values.
   */
  submitFilters = (filters) => {
    this.setState({ open: !this.state.open });
    this.props.dispatch(actions.change('DeadlineForms.filters.page', 0));
    this.getDeadlines(_.assign(_.clone(filters), { page: 0 }));
  };

  /**
   * Set sidebar active deadline handler
   *
   * @param id
   *   Number of deadline
   */
  setActive = (id) => {
    const {deadlines} = this.props.Deadlines;

    this.props.dispatch({type: 'DEADLINE_SET_ACTIVE', payload: _.filter(deadlines, (i) => i.id === id)[0]});
    hashHistory.push(`/mes-demandes/${id}`);
  };

  /**
   * Change status of deadline handler
   *
   * @param e
   */
  confirmDelete = (e) => {
    this.setState({ confirm: false });
    hashHistory.push(`/mes-demandes`);
    e.preventDefault();
  };

  /**
   * Change status of deadline handler
   *
   * @param e
   */
  changeStatus = (e) => {
    this.setState({ delete: false, change: false, confirm: false });
    this.props.dispatch(api.deadline.create({data: {type: 'change', id: this.props.Deadlines.active.id}, token: this.props.User.csrfToken}))
      .then(() => this.getDeadlines(this.props.filters) && hashHistory.push(`/mes-demandes`));
    e.preventDefault();
  };

  /**
   * Delete status of deadline handler
   *
   * @param e
   */
  deleteStatus = (e) => {
    this.setState({ delete: false, change: false, confirm: true  });
    this.props.dispatch(api.deadline.create({data: {type: 'delete', id: this.props.Deadlines.active.id}, token: this.props.User.csrfToken}))
      .then(() => this.getDeadlines(this.props.filters));
    e.preventDefault();
  };

  /**
   * Back to deadline list handler
   *
   * @param e
   */
  backToList = (e) => {
    this.setState({ delete: false, change: false });
    this.clear() && hashHistory.push(`/mes-demandes`);
    e.preventDefault();
  };

  /**
   * Sorting handler
   *
   * @param sortBy
   *   Field name
   */
  sort = (sortBy) => (e) => {
    let sort_order = this.props.filters.sort_by === sortBy ? this.props.filters.sort_order === 'ASC' ? 'DESC' : 'ASC' : 'ASC';
    let new_filter = _.assign(_.clone(this.props.filters), { sort_by: sortBy, sort_order: sort_order });
    this.props.dispatch(actions.change('DeadlineForms.filters', new_filter));
    this.getDeadlines(new_filter);
  };

  /**
   * {@inheritDoc}
   */
  render() {

    const {filters, Deadlines} = this.props;
    const {deadlines, active, count, loaded} = Deadlines;

    return (
      <div className="main">
        {this.state.change && <AproveFrame
          body="Souhaitez-vous changer le statut de cette ligne de demande <br/> de modification de date de livraison?"
          valider={this.changeStatus}
          annuler={this.backToList} />}
        {this.state.delete && <AproveFrame
          body="Souhaitez-vous supprimer cette ligne de demande <br> de modification de date de livraison?"
          valider={this.deleteStatus}
          annuler={this.backToList} />}
        {this.state.confirm && <AproveFrame
          body="La ligne de demande de modification de date de livraison a été supprimée <br/> Elle n'apparaitra plus dans votre tableau de demande"
          retour={this.confirmDelete} />}

        {loaded && !this.state.change && !this.state.delete && !this.state.confirm && <div>
          <div className="block-head">
            <div className="container">
              <Breadcrumb items={[{'title' : 'Mes DEMANDES DE MODIFICATION DE DATE DE LIVRAISON', 'href' : false}]} />
              <div className="block-ttl">
                <h1>Mes DEMANDES DE MODIFICATION DE DATE DE LIVRAISON</h1>
                <form action="#" className="filter-form">
                  <fieldset>
                    <div className="controls">
                      <a href="#" className="btn-filter" onClick={ this.toggleFilter }>
                        <span className="ico"><svg className="svg-ico"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#ico-filter" /></svg></span>
                        FILTRER
                      </a>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>

          <div className="container filters-block-wrapper">
            <VelocityTransitionGroup enter={{ animation: "slideDown" }} leave={{ animation: "slideUp" }}>
              {this.state.open && <Filters
                toggleFilter={ this.toggleFilter }
                submitFilters={ this.submitFilters }
              />}
            </VelocityTransitionGroup>
          </div>

          <div className="block-dashboard block-dashboard-table endContractsAnimation-processed">
            <div className="container">
              <CheckNewDeadlineTable
                forcePage={ filters.page }
                count={ count }
                sort={ this.sort }
                changePage={ this.changePage }
                active={active}
                deadlines={deadlines}
                setActive={this.setActive} />
              <div className="sidebar">
                <div className="aside-box">
                  {!active && <span className="notice">
                    Veuillez sélectionner un ligne pour voir son détail
                  </span>}
                  {active && <CheckNewDeadlineSidebar
                    toggleChange={this.toggleChange}
                    toggleDelete={this.toggleDelete}
                    active={active}
                  />}
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
