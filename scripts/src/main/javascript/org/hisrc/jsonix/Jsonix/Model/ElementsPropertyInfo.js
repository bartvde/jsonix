Jsonix.Model.ElementsPropertyInfo = Jsonix
		.Class(
				Jsonix.Model.AbstractElementsPropertyInfo,
				{
					elementTypeInfos : null,
					elementTypeInfosMap : null,
					initialize : function(mapping) {
						Jsonix.Util.Ensure.ensureObject(mapping);
						Jsonix.Model.AbstractElementsPropertyInfo.prototype.initialize
								.apply(this, [ mapping ]);
						var etis = mapping.elementTypeInfos||mapping.etis||undefined;
						Jsonix.Util.Ensure.ensureArray(etis);
						this.elementTypeInfos = etis;
					},
					unmarshalElement : function(context, input, scope, callback) {
						// TODO make sure it's the right event type
						var elementNameKey = input.getNameKey();
						var typeInfo = this.elementTypeInfosMap[elementNameKey];
						if (Jsonix.Util.Type.exists(typeInfo)) {
							return callback(typeInfo.unmarshal(context, input, scope));
						}
						// TODO better exception
						throw new Error("Element [" + elementNameKey + "] is not known in this context");
					},
					marshalElement : function(value, context, output, scope) {
						for ( var index = 0; index < this.elementTypeInfos.length; index++) {
							var elementTypeInfo = this.elementTypeInfos[index];
							var typeInfo = elementTypeInfo.typeInfo;
							if (typeInfo.isInstance(value, context, scope)) {
								var elementName = elementTypeInfo.elementName;
								this.marshalElementTypeInfo(elementName, typeInfo, value, context, output, scope);
								return;
							}
						}
						throw new Error("Could not find an element with type info supporting the value ["	+ value + "].");
					},
					doBuild : function(context, module) {
						this.elementTypeInfosMap = {};
						var etiti, etien;
						for ( var index = 0; index < this.elementTypeInfos.length; index++) {
							var elementTypeInfo = this.elementTypeInfos[index];
							Jsonix.Util.Ensure.ensureObject(elementTypeInfo);
							etiti = elementTypeInfo.typeInfo||elementTypeInfo.ti||'String';
							elementTypeInfo.typeInfo = context.resolveTypeInfo(etiti, module);
							etien = elementTypeInfo.elementName||elementTypeInfo.en||undefined;
							if (Jsonix.Util.Type.isObject(etien)) {
								elementTypeInfo.elementName = Jsonix.XML.QName.fromObject(etien);
							} else {
								Jsonix.Util.Ensure.ensureString(etien);
								elementTypeInfo.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, etien);
							}
							this.elementTypeInfosMap[elementTypeInfo.elementName.key] = elementTypeInfo.typeInfo;
						}
					},
					buildStructureElements : function(context, structure) {
						for ( var index = 0; index < this.elementTypeInfos.length; index++) {
							var elementTypeInfo = this.elementTypeInfos[index];
							structure.elements[elementTypeInfo.elementName.key] = this;
						}
					},
					CLASS_NAME : 'Jsonix.Model.ElementsPropertyInfo'
				});
