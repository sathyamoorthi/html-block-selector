/*
The MIT License (MIT)

Copyright (c) 2013 Sathyamoorthi <sathyamoorthi10@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, document, CodeMirror*/

define(function (require, exports, module) {
    "use strict";
    
    var EditorManager       = brackets.getModule("editor/EditorManager"),
        KeyBindingManager   = brackets.getModule("command/KeyBindingManager"),
        CommandManager      = brackets.getModule("command/CommandManager"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        shortcutCommand     = "htmlblockselector.select",
        ctrlClickPref       = "ctrlclick",
        ctrlShiftClickPref  = "ctrlshiftclick",
        preference;
    
    //https://github.com/sathyamoorthi/html-block-selector/issues/1    
    preference = PreferencesManager.getExtensionPrefs("htmlblockselector");
  
    function selectHTMLBlock() {
        var editor = EditorManager.getActiveEditor(),
            language,
            cm,
            matchTags;

        if (editor) {
            cm = editor._codeMirror;
            language = editor.document.getLanguage().getName().toLowerCase();

            if ($.inArray(language, ["html", "php", "xml"]) > -1) {
                matchTags = CodeMirror.findMatchingTag(cm, cm.getCursor());

                if (matchTags && matchTags.open && matchTags.close) {
                    cm.setSelection(matchTags.open.from, matchTags.close.to);
                }
            }
        }
    }
    
    function listenMouseClick() {
        var ctrl      = preference.get(ctrlClickPref),
            ctrlshift = preference.get(ctrlShiftClickPref);
        
        if (ctrl === true || ctrlshift === true) {            
            $("html").on("mousedown", function (e) {
                if ((e.ctrlKey || e.metaKey) && ((ctrl && !e.shiftKey) || (ctrlshift && e.shiftKey))) {
                    selectHTMLBlock();
                }
            });
        }
    }
    
  
    //keyboard handling
    KeyBindingManager.addBinding(shortcutCommand, "Ctrl-Shift-T");
    CommandManager.register("HTML block select", shortcutCommand, selectHTMLBlock);
        
    preference.definePreference(ctrlClickPref, "boolean", false).on("change", listenMouseClick);
    preference.definePreference(ctrlShiftClickPref, "boolean", false).on("change", listenMouseClick);    
    preference.save();
});