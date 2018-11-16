/** @format */
/**
 * External dependencies
 */
import { Component, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { filters } from './config';
import CouponsReportTable from './table';
import { ReportFilters } from '@woocommerce/components';

export default class extends Component {
	render() {
		const { query, path } = this.props;

		return (
			<Fragment>
				<ReportFilters query={ query } path={ path } filters={ filters } />
				<CouponsReportTable query={ query } />
			</Fragment>
		);
	}
}
