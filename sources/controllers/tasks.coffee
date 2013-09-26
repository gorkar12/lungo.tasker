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
      console.log 1
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
      console.log __Model.Task.counter()
      Lungo.Element.count("#important", __Model.Task.counter().length)
      Lungo.Element.count("#importantnav", __Model.Task.counter().length)

$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"
  Tasks.updateImportantCount()
