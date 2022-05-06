'use strict';(function(){var validLinkRegExp=/^<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>$/i;CKEDITOR.plugins.add('autoembed',{requires:'autolink,undo',lang:'ca,cs,de,de-ch,en,eo,es,eu,fr,it,km,ko,ku,mk,nb,nl,oc,pl,pt,pt-br,ru,sk,sv,tr,ug,uk,zh,zh-cn',init:function(editor){var currentId=1,embedCandidatePasted;editor.on('paste',function(evt){if(evt.data.dataTransfer.getTransferType(editor)==CKEDITOR.DATA_TRANSFER_INTERNAL){embedCandidatePasted=0;return;}
var match=evt.data.dataValue.match(validLinkRegExp);embedCandidatePasted=match!=null&&decodeURI(match[1])==decodeURI(match[2]);if(embedCandidatePasted){evt.data.dataValue='<a data-cke-autoembed="'+(++currentId)+'"'+evt.data.dataValue.substr(2);}},null,null,20);editor.on('afterPaste',function(){if(embedCandidatePasted){autoEmbedLink(editor,currentId);}});}});function autoEmbedLink(editor,id){var anchor=editor.editable().findOne('a[data-cke-autoembed="'+id+'"]'),lang=editor.lang.autoembed,notification;if(!anchor||!anchor.data('cke-saved-href')){return;}
var href=anchor.data('cke-saved-href'),widgetDef=CKEDITOR.plugins.autoEmbed.getWidgetDefinition(editor,href);if(!widgetDef){CKEDITOR.warn('autoembed-no-widget-def');return;}
var defaults=typeof widgetDef.defaults=='function'?widgetDef.defaults():widgetDef.defaults,element=CKEDITOR.dom.element.createFromHtml(widgetDef.template.output(defaults)),instance,wrapper=editor.widgets.wrapElement(element,widgetDef.name),temp=new CKEDITOR.dom.documentFragment(wrapper.getDocument());temp.append(wrapper);instance=editor.widgets.initOn(element,widgetDef);if(!instance){finalizeCreation();return;}
notification=editor.showNotification(lang.embeddingInProgress,'info');instance.loadContent(href,{noNotifications:true,callback:function(){var anchor=editor.editable().findOne('a[data-cke-autoembed="'+id+'"]');if(anchor){var selection=editor.getSelection(),insertRange=editor.createRange(),editable=editor.editable();editor.fire('saveSnapshot');editor.fire('lockSnapshot',{dontUpdate:true});var bookmark=selection.createBookmarks(false)[0],startNode=bookmark.startNode,endNode=bookmark.endNode||startNode;if(CKEDITOR.env.ie&&CKEDITOR.env.version<9&&!bookmark.endNode&&startNode.equals(anchor.getNext())){anchor.append(startNode);}
insertRange.setStartBefore(anchor);insertRange.setEndAfter(anchor);editable.insertElement(wrapper,insertRange);if(editable.contains(startNode)&&editable.contains(endNode)){selection.selectBookmarks([bookmark]);}else{startNode.remove();endNode.remove();}
editor.fire('unlockSnapshot');}
notification.hide();finalizeCreation();},errorCallback:function(){notification.hide();editor.widgets.destroy(instance,true);editor.showNotification(lang.embeddingFailed,'info');}});function finalizeCreation(){editor.widgets.finalizeCreation(temp);}}
CKEDITOR.plugins.autoEmbed={getWidgetDefinition:function(editor,url){var opt=editor.config.autoEmbed_widget||'embed,embedSemantic',name,widgets=editor.widgets.registered;if(typeof opt=='string'){opt=opt.split(',');while((name=opt.shift())){if(widgets[name]){return widgets[name];}}}else if(typeof opt=='function'){return widgets[opt(url)];}
return null;}};})();