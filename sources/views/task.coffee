class __View.Task extends Monocle.View

  template  : """
    <li class="{{style()}}">
      <div class="on-right">{{list}}</div>
      <strong>{{name}}</strong>
      <small>{{description}}</small>
    </li>
  """

  constructor: ->
    super
    @append @model
    __Model.Task.bind "update", @bindTaskUpdated


  bindTaskUpdated: (task)  =>
    if task.uid is @model.uid
        @refresh()
    


  events:
    "swipeLeft li"  :  "onDelete"
    "hold li"       :  "onDone"
    "singleTap li"  :  "onView"

  elements:
    "input.toggle"             : "toggle"

  onDone: (event) ->
    console.log "[DONE]", @model
    @model.updateAttributes done: !@model.done
    @refresh()

  onDelete: (event) ->
    Lungo.Notification.confirm
      icon: "remove-sign"
      title: "Delete."
      description: "¿Are you sure?"
      accept:
        icon: "checkmark"
        label: "Accept"
        callback: =>
          @model.destroy()
          @remove() 
          @refresh()
          console.log "[DELETE]", @model

      cancel:
        icon: "close"
        label: "Cancel"
        callback: ->
          console.log "Task is not deleted!"




  onView: (event) ->
    __Controller.Task.show @model
