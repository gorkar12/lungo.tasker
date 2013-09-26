class __View.Task extends Monocle.View

  template  : """
    <li class={{style()}}>
      <div class="on-right">{{list}}</div>
      <strong>{{name}}</strong>
      <small>{{description}}</small>
    </li>
  """

  constructor: ->
    super
    @append @model
    __Model.Task.bind "update", @bindTaskSaved

  events:
    "swipeLeft li"  :  "onDelete"
    "hold li"       :  "onDone"
    "singleTap li"  :  "onView"

  elements:
    "input.toggle"             : "toggle"

  bindTaskSaved: (task) =>
    if task.uid is @model.uid
      @refresh()

  onDone: (event) ->
    @model.updateAttributes done: !@model.done
    __Controller.TasksCtrl.updateImportantCount()
    @refresh()
    console.log @model

  onDelete: (event) ->
    Lungo.Notification.confirm
      icon: "user"
      title: "Title of confirm."
      description: "Description of confirm."
      accept:
        icon: "checkmark"
        label: "Accept"
        callback: =>
          @model.destroy()
          @remove()
      cancel:
        icon: "close"
        label: "Cancel"
        callback: ->
          console.log "Canceled"
        

  onView: (event) ->
    __Controller.Task.show @model
