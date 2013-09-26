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
      __Model.Task.bind "destroy", @updateCount
      __Model.Task.bind "update", @bindTaskUpdated

    bindTaskUpdated: (task) =>
        Lungo.Router.back()
        Lungo.Notification.hide()
        @updateCount()

    onNew: (event) ->
      __Controller.Task.new()

    updateCount: ->
      Lungo.Element.count("#important", __Model.Task.important().length);
      Lungo.Element.count("#importantnav", __Model.Task.important().length);


    bindTaskCreated: (task) =>
      context = if task.important is true then "high" else "normal"
      new __View.Task model: task, container: "article##{context} ul"
      Lungo.Router.back()
      Lungo.Notification.hide()
      @updateCount()

$$ ->
  Lungo.init({})
  Tasks = new __Controller.TasksCtrl "section#tasks"
