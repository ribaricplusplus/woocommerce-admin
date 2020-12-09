/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { Card, CardBody } from '@wordpress/components';
import { List } from '@woocommerce/components';
import { getAdminLink } from '@woocommerce/wc-admin-settings';
import { recordEvent } from '@woocommerce/tracks';

/**
 * Internal dependencies
 */
import { ProductTemplateModal } from './products/product-template-modal';

const subTasks = [
	{
		title: __( 'Start with a template (recommended)', 'woocommerce-admin' ),
		content: __(
			'For small stores we recommend adding products manually',
			'woocommerce-admin'
		),
		before: <i className="material-icons-outlined">add_box</i>,
		after: <i className="material-icons-outlined">chevron_right</i>,
		onClick: () =>
			recordEvent( 'tasklist_add_product', {
				method: 'product_template',
			} ),
	},
	{
		title: __( 'Add manually (recommended)', 'woocommerce-admin' ),
		content: __(
			'For small stores we recommend adding products manually',
			'woocommerce-admin'
		),
		before: <i className="material-icons-outlined">add_box</i>,
		after: <i className="material-icons-outlined">chevron_right</i>,
		onClick: () =>
			recordEvent( 'tasklist_add_product', { method: 'manually' } ),
		href: getAdminLink(
			'post-new.php?post_type=product&wc_onboarding_active_task=products&tutorial=true'
		),
	},
	{
		title: __( 'Import', 'woocommerce-admin' ),
		content: __(
			'For larger stores we recommend importing all products at once via CSV file',
			'woocommerce-admin'
		),
		before: <i className="material-icons-outlined">import_export</i>,
		after: <i className="material-icons-outlined">chevron_right</i>,
		onClick: () =>
			recordEvent( 'tasklist_add_product', { method: 'import' } ),
		href: getAdminLink(
			'edit.php?post_type=product&page=product_importer&wc_onboarding_active_task=product-import'
		),
	},
	{
		title: __( 'Migrate', 'woocommerce-admin' ),
		content: __(
			'For stores currently selling elsewhere we suggest using a product migration service',
			'woocommerce-admin'
		),
		before: <i className="material-icons-outlined">cloud_download</i>,
		after: <i className="material-icons-outlined">chevron_right</i>,
		onClick: () =>
			recordEvent( 'tasklist_add_product', { method: 'migrate' } ),
		// @todo This should be replaced with the in-app purchase iframe when ready.
		href: 'https://woocommerce.com/products/cart2cart/',
		target: '_blank',
	},
];

export default function Products() {
	const [ selectTemplate, setSelectTemplate ] = useState( null );
	return (
		<Fragment>
			<Card className="woocommerce-task-card">
				<CardBody size={ null }>
					<List items={ subTasks } />
				</CardBody>
			</Card>
			<ProductTemplateModal />
		</Fragment>
	);
}
