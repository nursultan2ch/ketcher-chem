import { h, Component } from 'preact';
import { connect } from 'preact-redux';
/** @jsx h */
import { updateFormState } from '../actions/form-action.es';
import { setDefaultSettings, cancelChanges } from '../actions/settings-action.es';

import { settings as settingsSchema } from '../settings-options.es';
import { form as Form, Field } from '../component/form';

import Dialog from '../component/dialog';
import Accordion from '../component/accordion';
import SystemFonts from '../component/systemfonts';
import SaveButton from '../component/savebutton';
import OpenButton from '../component/openbutton';
import Input from '../component/input';

function Settings(props) {
	let { server, stateForm, valid, dispatch, ...prop } = props;
	let tabs = ['Rendering customization options', 'Atoms', 'Bonds', '3D Viewer', 'Options for debugging'];
	let activeTabs = {'0': true, '1': false, '2': false, '3': false, '4': false};
	return (
		<Dialog title="Settings" className="settings"
				result={() => stateForm} valid={() => valid} params={prop}
				buttons={[
					<OpenOpts server={server} dispatch={dispatch}/>,
					<SaveOpts opts={stateForm}/>,
					<Reset dispatch={dispatch}/>,
					"OK", <Cancel dispatch={dispatch} onCancel={prop.onCancel}/>]} >
			<Form storeName="settings" schema={settingsSchema}>
				<Accordion className="accordion" captions={tabs} active={activeTabs}>
					<fieldset className="render">
						<SelectCheckbox name="resetToSelect"/>
						<SelectCheckbox name="showValenceWarnings"/>
						<SelectCheckbox name="atomColoring"/>
						<SelectCheckbox name="hideChiralFlag"/>
						<SelectFont name="font"/>
						<FieldMeasure name="fontsz"/>
						<FieldMeasure name="fontszsub"/>
					</fieldset>
					<fieldset className="atoms">
						<SelectCheckbox name="carbonExplicitly"/>
						<SelectCheckbox name="showCharge"/>
						<SelectCheckbox name="showValence"/>
						<Field name="showHydrogenLabels"/>
					</fieldset>
					<fieldset className="bonds">
						<SelectCheckbox name="aromaticCircle"/>
						<FieldMeasure name="doubleBondWidth"/>
						<FieldMeasure name="bondThickness"/>
						<FieldMeasure name="stereoBondWidth"/>
					</fieldset>
					<fieldset className="3dView">
						<Field name="miewMode"/>
						<Field name="miewTheme"/>
						<Field name="miewAtomLabel"/>
					</fieldset>
					<fieldset className="debug">
						<SelectCheckbox name="showAtomIds"/>
						<SelectCheckbox name="showBondIds"/>
						<SelectCheckbox name="showHalfBondIds"/>
						<SelectCheckbox name="showLoopIds"/>
					</fieldset>
				</Accordion>
			</Form>
		</Dialog>
	);
}

function SelectCheckbox(props, {schema}) {
	let desc = {
		title: schema.properties[props.name].title,
		enum: [true, false],
		enumNames: ['on', 'off'],
	};
	return (
		<Field schema={desc} {...props}/>
	);
}

function SelectFont(props, {schema, stateStore}) {
	let {name} = props;
	let title = schema.properties[name].title;
	return (
		<label>
			{title}:<SystemFonts {...stateStore.field(name)} />
		</label>
	);
}

class FieldMeasure extends Component {
	constructor(props) {
		super(props);
		this.state = { meas: 'px' };
	}
	handleChange(value, onChange) {
		let convValue = convertValue(value, this.state.meas, 'px');
		this.state.cust = value;
		onChange(convValue);
	}
	render() {
		let { meas, cust } = this.state;
		let { name, ...props } = this.props;
		let { schema, stateStore } = this.context;
		let { value, onChange } = stateStore.field(name);
		if (convertValue(cust, meas, 'px') !== value) this.setState({ meas: 'px', cust: value }); // Hack: New store (RESET)
		return (
			<label {...props} className="measure-field">
				{schema.properties[name].title}:
				<Input schema={schema.properties[name]} value={cust}
					   step={meas === 'px' || meas === 'pt' ? '1' : '0.001'}
					   onChange={(v) => this.handleChange(v, onChange)} />
				<Input schema={{enum: ['cm', 'px', 'pt', 'inch']}}
					   value={meas}
					   onChange={(m) => this.setState({ meas: m, cust: convertValue(this.state.cust, this.state.meas, m)})}/>
			</label>
		);
	}
}

const SaveOpts = ({opts}) =>
	<SaveButton className="save" data={JSON.stringify(opts)} filename={'ketcher-settings'}>
		Save To File…
	</SaveButton>;

const OpenOpts = ({server, dispatch}) =>
	<OpenButton className="open" server={server}
				onLoad={ newOpts => {
					try {
						dispatch(updateFormState('settings', { stateFrom: JSON.parse(newOpts) }));
					} catch (ex) {
						console.info('Bad file');
					}
				} }>
		Open From File…
	</OpenButton>;

const Reset = ({dispatch}) =>
	<button onClick={() => dispatch(setDefaultSettings())}>
		Reset
	</button>;

const Cancel = ({dispatch, onCancel}) =>
	<button onClick={() => {
		dispatch(cancelChanges());
		onCancel();
	}}>
		Cancel
	</button>;

function convertValue(value, measureFrom, measureTo) {
	if (!value && value !== 0) return null;
	var measureMap = {
		'px': 1,
		'cm': 37.795278,
		'pt': 1.333333,
		'inch': 96,
	};
	return (measureTo === 'px' || measureTo === 'pt')
		? (value * measureMap[measureFrom] / measureMap[measureTo]).toFixed( ) - 0
		: (value * measureMap[measureFrom] / measureMap[measureTo]).toFixed(3) - 0;
}

export default connect((store) => {
	return {
		stateForm: store.settings.stateForm,
		valid: store.settings.valid
	};
})(Settings);
