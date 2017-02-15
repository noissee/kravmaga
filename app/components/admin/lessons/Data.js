// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';

// components
import LessonEntry from './Entry';
import ManageLesson from './ManageLesson';
import LessonFields from './LessonFields';

class LessonData extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    componentDidMount() {
        this._requestData();
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            LessonActions.setIsUpdating(false);
        } else {
            LessonActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();
        const mandatoryFields = ['start', 'end', 'group', 'location'];

        for (let i = 0; i < mandatoryFields.length; i++) {
            if (!updatable[mandatoryFields[i]]) {
                return toastr.error('Lūdzu aizpildiet visus obligātos laukus!');
            }
        }

        const { start , end} = updatable;

        if (new Date(start) >=  new Date(end)) {
            return toastr.error('Beigu datumam un laikam jābūt mazāka par sākuma datumu un laiku!');
        }

        LessonActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    initCreate() {
        LessonActions.clearUpdatable({});
        LessonActions.setIsCreating(true);
    }

    update(updatable, token) {
        LessonActions.update(updatable, token)
            .done(() => this._onRequestDone(LessonActions.setIsUpdating))
            .fail(() => this._onRequestFailed());
    }

    create(updatable, token) {
        LessonActions.create(updatable, token)
            .done(() => this._onRequestDone(LessonActions.setIsCreating))
            .fail(() => this._onRequestFailed());
    }

    renderList(entry, index) {
        return (
            <LessonEntry
                key={`LessonEntry${index}`}
                index={index}
                entry={entry}/>
        );
    }

    /**
     * Requests lessons with the applied filters and config,
     * as well as group info, which is used for displaying groups names.
     *
     * @private
     */
    _requestData() {
        const { token } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        LessonActions.getList(token, LessonActions.listReceived, filters, sorters, config);
        GroupActions.getList(token, LessonActions.groupsReceived);
    }

    /**
     * Request success handler.
     * Calls request success action with false - setIsUpdating or setIsCreating for update and create respectively.
     *
     * Also calls the method to request new data in order to apply the filters, sorters, config properly.
     *
     * @param {Function} action Lesson action to call on success
     * @private
     */
    _onRequestDone(action) {
        action(false);
        LessonActions.setIsRequesting(false);

        this._requestData();
    }

    /**
     * Request failed handler.
     *
     * @private
     */
    _onRequestFailed() {
        LessonActions.setIsRequesting(false)
    }

    render() {
        const {
            list, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Sākums', 'Beigas', 'Grupa', 'Lokācija', 'Ieradīsies', 'Komentārs', 'Darbības'];

        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreate.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`LessonTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
                <ManageLesson
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <LessonFields />
                </ManageLesson>
            </Row>
        );
    }
}

export default connectToStores(LessonData);
