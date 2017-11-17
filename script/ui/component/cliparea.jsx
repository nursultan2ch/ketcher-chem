/****************************************************************************
 * Copyright 2017 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import { h, Component } from 'preact';
/** @jsx h */

const ieCb = window.clipboardData;

class ClipArea extends Component {
	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		const el = this.refs ? this.refs.base : this.base;
		this.target = this.props.target || el.parentNode;

		this.listeners = {
			'mouseup': event => {
				if (this.props.focused() && !isFormElement(event.target))
					autofocus(el);
			},
			'mousedown': event => {
				if (event.shiftKey && !isFormElement(event.target))
					event.preventDefault();
			},
			'copy': event => {
				if (this.props.focused() && this.props.onCopy) {
					const data = this.props.onCopy();
					if (data)
						copy(event.clipboardData, data);
					event.preventDefault();
				}
			},
			'cut': event => {
				if (this.props.focused() && this.props.onCut) {
					const data = this.props.onCut();
					if (data)
						copy(event.clipboardData, data);
					event.preventDefault();
				}
			},
			'paste': event => {
				if (this.props.focused() && this.props.onPaste) {
					const data = paste(event.clipboardData, this.props.formats);
					if (data)
						this.props.onPaste(data);
					event.preventDefault();
				}
			}
		};

		Object.keys(this.listeners).forEach(en => {
			this.target.addEventListener(en, this.listeners[en]);
		});
	}

	componentWillUnmount() {
		Object.keys(this.listeners).forEach(en => {
			this.target.removeEventListener(en, this.listeners[en]);
		});
	}

	render() {
		return (
			<textarea className="cliparea" contentEditable={true}
					  autoFocus={true}/>
		);
	}
}

function isFormElement(el) {
	if (el.tagName === 'INPUT' && el.type === 'button') return false;
	return ['INPUT', 'SELECT', 'TEXTAREA', 'OPTION'].indexOf(el.tagName) > -1;
}

function autofocus(cliparea) {
	cliparea.value = ' ';
	cliparea.focus();
	cliparea.select();
}

function copy(cb, data) {
	if (!cb && ieCb) {
		ieCb.setData('text', data['text/plain']);
	} else {
		cb.setData('text/plain', data['text/plain']);
		try {
			Object.keys(data).forEach(function (fmt) {
				cb.setData(fmt, data[fmt]);
			});
		} catch (ex) {
			console.info('Could not write exact type', ex);
		}
	}
}

function paste(cb, formats) {
	let data = {};
	if (!cb && ieCb) {
		data['text/plain'] = ieCb.getData('text');
	} else {
		data['text/plain'] = cb.getData('text/plain');
		data = formats.reduce(function (data, fmt) {
			const d = cb.getData(fmt);
			if (d)
				data[fmt] = d;
			return data;
		}, data);
	}
	return data;
}

export const actions = ['cut', 'copy', 'paste'];

export function exec(action) {
	let enabled = document.queryCommandSupported(action);
	if (enabled) try {
		enabled = document.execCommand(action) || ieCb;
	} catch (ex) {
		// FF < 41
		enabled = false;
	}
	return enabled;
}

export default ClipArea;
