/*
 * Jsonix is a JavaScript library which allows you to convert between XML
 * and JavaScript object structures.
 *
 * Copyright (c) 2010 - 2014, Alexey Valikov, Highsource.org
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Alexey Valikov nor the
 *       names of contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ALEXEY VALIKOV BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Jsonix.Model.PropertyInfo = Jsonix
		.Class({
			name : null,
			collection : false,
			defaultElementNamespaceURI : '',
			defaultAttributeNamespaceURI : '',
			built : false,
			initialize : function(options) {
				Jsonix.Util.Ensure.ensureObject(options);
				Jsonix.Util.Ensure.ensureString(options.name);
				this.name = options.name;
				if (Jsonix.Util.Type
						.isString(options.defaultElementNamespaceURI)) {
					this.defaultElementNamespaceURI = options.defaultElementNamespaceURI;
				}
				if (Jsonix.Util.Type
						.isString(options.defaultAttributeNamespaceURI)) {
					this.defaultAttributeNamespaceURI = options.defaultAttributeNamespaceURI;
				}
				if (Jsonix.Util.Type.isBoolean(options.collection)) {
					this.collection = options.collection;
				} else {
					this.collection = false;
				}
			},
			build : function(context, module) {
				if (!this.built) {
					this.doBuild(context, module);
					this.built = true;
				}
			},
			doBuild : function(context, module) {
				throw new Error("Abstract method [doBuild].");
			},
			buildStructure : function(context, structure) {
				throw new Error("Abstract method [buildStructure].");
			},
			setProperty : function(object, value) {
				if (Jsonix.Util.Type.exists(value)) {
					if (this.collection) {
						Jsonix.Util.Ensure.ensureArray(value,
								'Collection property requires an array value.');
						if (!Jsonix.Util.Type.exists(object[this.name])) {
							object[this.name] = [];
						}
						for ( var index = 0; index < value.length; index++) {
							object[this.name].push(value[index]);
						}

					} else {
						object[this.name] = value;
					}
				}
			},
			CLASS_NAME : 'Jsonix.Model.PropertyInfo'
		});