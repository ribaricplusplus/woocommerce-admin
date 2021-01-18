/**
 * External dependencies
 */
import { act, render, findByText, queryByTestId } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { TaskDashboard } from '../index.js';
import { TaskList } from '../list';
import { getAllTasks } from '../tasks';

jest.mock( '@wordpress/api-fetch' );
jest.mock( '../tasks' );

describe( 'TaskDashboard and TaskList', () => {
	afterEach( () => jest.clearAllMocks() );
	const MockTask = () => {
		return <div>mock task</div>;
	};
	const tasks = {
		setup: [
			{
				key: 'optional',
				title: 'This task is optional',
				container: <MockTask />,
				completed: false,
				visible: true,
				time: '1 minute',
				isDismissable: true,
				type: 'setup',
			},
			{
				key: 'required',
				title: 'This task is required',
				container: null,
				completed: false,
				visible: true,
				time: '1 minute',
				isDismissable: false,
				type: 'setup',
			},
			{
				key: 'completed',
				title: 'This task is completed',
				container: null,
				completed: true,
				visible: true,
				time: '1 minute',
				isDismissable: true,
				type: 'setup',
			},
		],
		extension: [
			{
				key: 'extension',
				title: 'This task is an extension',
				container: null,
				completed: false,
				visible: true,
				time: '1 minute',
				isDismissable: true,
				type: 'extension',
			},
		],
	};
	const shorterTasksList = [
		{
			key: 'completed-1',
			title: 'This task is completed',
			container: null,
			completed: true,
			visible: true,
			time: '1 minute',
			isDismissable: true,
			type: 'setup',
		},
		{
			key: 'completed-2',
			title: 'This task is completed',
			container: null,
			completed: true,
			visible: true,
			time: '1 minute',
			isDismissable: true,
			type: 'setup',
		},
	];

	it( 'renders the "Finish setup" and "Extensions setup" tasks lists', async () => {
		apiFetch.mockResolvedValue( {} );
		getAllTasks.mockReturnValue( tasks );
		const { container } = render(
			<TaskDashboard
				dismissedTasks={ [] }
				profileItems={ {} }
				query={ {} }
				updateOptions={ () => {} }
			/>
		);

		// Wait for the setup task list to render.
		expect( await findByText( container, 'Finish setup' ) ).toBeDefined();

		// Wait for the extension task list to render.
		expect(
			await findByText( container, 'Extensions setup' )
		).toBeDefined();
	} );

	it( 'renders a dismiss button for tasks that are optional and incomplete', async () => {
		apiFetch.mockResolvedValue( {} );
		getAllTasks.mockReturnValue( tasks );
		const { container } = render(
			<TaskDashboard
				dismissedTasks={ [] }
				profileItems={ {} }
				query={ {} }
				updateOptions={ () => {} }
			/>
		);

		// The `optional` task has a dismiss button.
		expect(
			queryByTestId( container, 'optional-dismiss-button' )
		).toBeDefined();

		// The `required` task does not have a dismiss button.
		expect(
			queryByTestId( container, 'required-dismiss-button' )
		).toBeNull();

		// The `completed` task does not have a dismiss button.
		expect(
			queryByTestId( container, 'completed-dismiss-button' )
		).toBeNull();
	} );

	it( 'renders the selected task', async () => {
		apiFetch.mockResolvedValue( {} );
		getAllTasks.mockReturnValue( tasks );
		const { container } = render(
			<TaskDashboard
				dismissedTasks={ [] }
				isSetupTaskListHidden={ true }
				profileItems={ {} }
				query={ { task: 'optional' } }
				updateOptions={ () => {} }
			/>
		);

		// Wait for the task to render.
		expect( await findByText( container, 'mock task' ) ).toBeDefined();
	} );

	it( 'renders only the extended task list', () => {
		apiFetch.mockResolvedValue( {} );
		getAllTasks.mockReturnValue( tasks );
		const { queryByText } = render(
			<TaskDashboard
				dismissedTasks={ [] }
				isSetupTaskListHidden={ true }
				profileItems={ {} }
				query={ {} }
				updateOptions={ () => {} }
			/>
		);

		expect( queryByText( 'Finish setup' ) ).toBeNull();

		expect( queryByText( 'Extensions setup' ) ).not.toBeNull();
	} );

	it( 'sets homescreen layout default when dismissed', () => {
		const updateOptions = jest.fn();
		const { getByRole } = render(
			<TaskList
				dismissedTasks={ [] }
				profileItems={ {} }
				query={ {} }
				trackedCompletedTasks={ shorterTasksList }
				updateOptions={ updateOptions }
				tasks={ shorterTasksList }
			/>
		);

		userEvent.click( getByRole( 'button', { name: 'Task List Options' } ) );
		userEvent.click( getByRole( 'button', { name: 'Hide this' } ) );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_hidden: 'yes',
			woocommerce_task_list_prompt_shown: true,
			woocommerce_default_homepage_layout: 'two_columns',
		} );
	} );

	it( 'sets homescreen layout default when completed', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ shorterTasksList }
					updateOptions={ updateOptions }
					tasks={ shorterTasksList }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_complete: 'yes',
			woocommerce_default_homepage_layout: 'two_columns',
		} );
	} );

	it( 'sets setup tasks list as completed', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					isComplete={ false }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ shorterTasksList }
					updateOptions={ updateOptions }
					tasks={ shorterTasksList }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_complete: 'yes',
			woocommerce_default_homepage_layout: 'two_columns',
		} );
	} );

	it( 'sets setup tasks list as incompleted', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		const { setup } = tasks;
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					isComplete={ true }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ shorterTasksList }
					updateOptions={ updateOptions }
					tasks={ [ ...setup ] }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_complete: 'no',
			woocommerce_default_homepage_layout: 'two_columns',
		} );
	} );

	it( 'sets extended tasks list as completed', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					isComplete={ false }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ [] }
					updateOptions={ updateOptions }
					tasks={ shorterTasksList }
					name={ 'extended_task_list' }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_extended_task_list_complete: 'yes',
		} );
	} );

	it( 'Add untracked completed task', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		const { setup, extension } = tasks;
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ [] }
					updateOptions={ updateOptions }
					tasks={ [ ...setup, ...extension ] }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_tracked_completed_tasks: [ 'completed' ],
		} );
	} );

	it( 'Untrack an incomplete but already tracked task', () => {
		apiFetch.mockResolvedValue( {} );
		const updateOptions = jest.fn();
		const { setup, extension } = tasks;
		act( () => {
			render(
				<TaskList
					dismissedTasks={ [] }
					profileItems={ {} }
					query={ {} }
					trackedCompletedTasks={ [ 'completed', 'extension' ] }
					updateOptions={ updateOptions }
					tasks={ [ ...setup, ...extension ] }
				/>
			);
		} );

		expect( updateOptions ).toHaveBeenCalledWith( {
			woocommerce_task_list_tracked_completed_tasks: [ 'completed' ],
		} );
	} );
} );
