'use strict';(function(){CKEDITOR.plugins.add('uploadwidget',{lang:'ca,cs,da,de,de-ch,el,en,eo,es,eu,fr,gl,hu,id,it,ja,km,ko,ku,nb,nl,no,oc,pl,pt,pt-br,ru,sv,tr,ug,uk,zh,zh-cn',requires:'widget,clipboard,filetools,notificationaggregator',init:function(editor){editor.filter.allow('*[!data-widget,!data-cke-upload-id]');}});function addUploadWidget(editor,name,def){var fileTools=CKEDITOR.fileTools,uploads=editor.uploadRepository,priority=def.supportedTypes?10:20;if(def.fileToElement){editor.on('paste',function(evt){var data=evt.data,dataTransfer=data.dataTransfer,filesCount=dataTransfer.getFilesCount(),loadMethod=def.loadMethod||'loadAndUpload',file,i;if(data.dataValue||!filesCount){return;}
for(i=0;i<filesCount;i++){file=dataTransfer.getFile(i);if(!def.supportedTypes||fileTools.isTypeSupported(file,def.supportedTypes)){var el=def.fileToElement(file),loader=uploads.create(file);if(el){loader[loadMethod](def.uploadUrl,def.additionalRequestParameters);CKEDITOR.fileTools.markElement(el,name,loader.id);if(loadMethod=='loadAndUpload'||loadMethod=='upload'){CKEDITOR.fileTools.bindNotifications(editor,loader);}
data.dataValue+=el.getOuterHtml();}}}},null,null,priority);}
CKEDITOR.tools.extend(def,{downcast:function(){return new CKEDITOR.htmlParser.text('');},init:function(){var widget=this,id=this.wrapper.findOne('[data-cke-upload-id]').data('cke-upload-id'),loader=uploads.loaders[id],capitalize=CKEDITOR.tools.capitalize,oldStyle,newStyle;loader.on('update',function(evt){if(!widget.wrapper||!widget.wrapper.getParent()){if(!editor.editable().find('[data-cke-upload-id="'+id+'"]').count()){loader.abort();}
evt.removeListener();return;}
editor.fire('lockSnapshot');var methodName='on'+capitalize(loader.status);if(typeof widget[methodName]==='function'){if(widget[methodName](loader)===false){editor.fire('unlockSnapshot');return;}}
newStyle='cke_upload_'+loader.status;if(widget.wrapper&&newStyle!=oldStyle){oldStyle&&widget.wrapper.removeClass(oldStyle);widget.wrapper.addClass(newStyle);oldStyle=newStyle;}
if(loader.status=='error'||loader.status=='abort'){editor.widgets.del(widget);}
editor.fire('unlockSnapshot');});loader.update();},replaceWith:function(data,mode){if(data.trim()===''){editor.widgets.del(this);return;}
var wasSelected=(this==editor.widgets.focused),editable=editor.editable(),range=editor.createRange(),bookmark,bookmarks;if(!wasSelected){bookmarks=editor.getSelection().createBookmarks();}
range.setStartBefore(this.wrapper);range.setEndAfter(this.wrapper);if(wasSelected){bookmark=range.createBookmark();}
editable.insertHtmlIntoRange(data,range,mode);editor.widgets.checkWidgets({initOnlyNew:true});editor.widgets.destroy(this,true);if(wasSelected){range.moveToBookmark(bookmark);range.select();}else{editor.getSelection().selectBookmarks(bookmarks);}}});editor.widgets.add(name,def);}
function markElement(element,widgetName,loaderId){element.setAttributes({'data-cke-upload-id':loaderId,'data-widget':widgetName});}
function bindNotifications(editor,loader){var aggregator,task=null;loader.on('update',function(){if(!task&&loader.uploadTotal){createAggregator();task=aggregator.createTask({weight:loader.uploadTotal});}
if(task&&loader.status=='uploading'){task.update(loader.uploaded);}});loader.on('uploaded',function(){task&&task.done();});loader.on('error',function(){task&&task.cancel();editor.showNotification(loader.message,'warning');});loader.on('abort',function(){task&&task.cancel();editor.showNotification(editor.lang.uploadwidget.abort,'info');});function createAggregator(){aggregator=editor._.uploadWidgetNotificaionAggregator;if(!aggregator||aggregator.isFinished()){aggregator=editor._.uploadWidgetNotificaionAggregator=new CKEDITOR.plugins.notificationAggregator(editor,editor.lang.uploadwidget.uploadMany,editor.lang.uploadwidget.uploadOne);aggregator.once('finished',function(){var tasks=aggregator.getTaskCount();if(tasks===0){aggregator.notification.hide();}else{aggregator.notification.update({message:tasks==1?editor.lang.uploadwidget.doneOne:editor.lang.uploadwidget.doneMany.replace('%1',tasks),type:'success',important:1});}});}}}
if(!CKEDITOR.fileTools){CKEDITOR.fileTools={};}
CKEDITOR.tools.extend(CKEDITOR.fileTools,{addUploadWidget:addUploadWidget,markElement:markElement,bindNotifications:bindNotifications});})();