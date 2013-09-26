class __Controller.TasksCtrl extends Monocle.Controller

    events:
      "click [data-action=new]"    :   "onNew"

    elements:
      "#pending"    :   "pending"
      "#important"  :   "important"
      "input"                 :   "name"

    constructor: ->
      super
      __Model.Task.bind "create", @bindTaskCreated
      __Model.Task.bind "destroy", @updateImportantCount
      __Model.Task.bind "update", @bindTaskUpdated

    onNew: (event) ->
      __Controller.Task.new()

    bindTaskCreated: (task) =>
      context = if task.important is true then "high" else "normal"
      new __View.Task model: task, container: "article##{context} ul"
      Lungo.Router.back()
      Lungo.Notification.hide()
      @updateImportantCount()

    bindTaskUpdated: (task) =>
      Lungo.Router.back()
      Lungo.Notification.hide()
      @updateImportantCount()

    updateImportantCount: ->
      Lungo.Element.count("#important", __Model.Task.important().length)
      Lungo.Element.count("#importantnav", __Model.Task.important().length)

$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"
  Tasks.updateImportantCount()
