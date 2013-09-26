(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Model.Task = (function(_super) {
    __extends(Task, _super);

    function Task() {
      _ref = Task.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Task.fields("name", "description", "list", "when", "important", "done");

    Task.pending = function() {
      return this.select(function(task) {
        return !task.done;
      });
    };

    Task.completed = function() {
      return this.select(function(task) {
        return !!task.done;
      });
    };

    Task.important = function() {
      return this.select(function(task) {
        return task.important === true;
      });
    };

    Task.counter = function() {
      return this.select(function(task) {
        return task.important && !task.done;
      });
    };

    Task.prototype.style = function() {
      if (this.done) {
        return "accept";
      } else {
        return "cancel";
      }
    };

    return Task;

  })(Monocle.Model);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __View.Task = (function(_super) {
    __extends(Task, _super);

    Task.prototype.template = "<li class={{style()}}>\n  <div class=\"on-right\">{{list}}</div>\n  <strong>{{name}}</strong>\n  <small>{{description}}</small>\n</li>";

    function Task() {
      this.bindTaskSaved = __bind(this.bindTaskSaved, this);
      Task.__super__.constructor.apply(this, arguments);
      this.append(this.model);
      __Model.Task.bind("update", this.bindTaskSaved);
    }

    Task.prototype.events = {
      "swipeLeft li": "onDelete",
      "hold li": "onDone",
      "singleTap li": "onView"
    };

    Task.prototype.elements = {
      "input.toggle": "toggle"
    };

    Task.prototype.bindTaskSaved = function(task) {
      if (task.uid === this.model.uid) {
        return this.refresh();
      }
    };

    Task.prototype.onDone = function(event) {
      this.model.updateAttributes({
        done: !this.model.done
      });
      __Controller.TasksCtrl.updateImportantCount();
      this.refresh();
      return console.log(this.model);
    };

    Task.prototype.onDelete = function(event) {
      var _this = this;
      return Lungo.Notification.confirm({
        icon: "user",
        title: "Title of confirm.",
        description: "Description of confirm.",
        accept: {
          icon: "checkmark",
          label: "Accept",
          callback: function() {
            _this.model.destroy();
            return _this.remove();
          }
        },
        cancel: {
          icon: "close",
          label: "Cancel",
          callback: function() {
            return console.log("Canceled");
          }
        }
      });
    };

    Task.prototype.onView = function(event) {
      return __Controller.Task.show(this.model);
    };

    return Task;

  })(Monocle.View);

}).call(this);

(function() {
  var TaskCtrl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TaskCtrl = (function(_super) {
    __extends(TaskCtrl, _super);

    TaskCtrl.prototype.elements = {
      "input[name=name]": "name",
      "textarea[name=description]": "description",
      "input[name=list]": "list",
      "select[name=when]": "when",
      "input[name=important]": "important"
    };

    TaskCtrl.prototype.events = {
      "click [data-action=save]": "onSave"
    };

    function TaskCtrl() {
      TaskCtrl.__super__.constructor.apply(this, arguments);
      this["new"] = this._new;
      this.show = this._show;
    }

    TaskCtrl.prototype.onSave = function(event) {
      if (this.current) {
        return this.current.updateAttributes({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      } else {
        Lungo.Notification.show();
        return __Model.Task.create({
          name: this.name.val(),
          description: this.description.val(),
          list: this.list.val(),
          when: this.when.val(),
          important: this.important[0].checked
        });
      }
    };

    TaskCtrl.prototype._new = function(current) {
      this.current = current != null ? current : null;
      this.name.val("");
      this.description.val("");
      this.list.attr("office");
      this.when.val("");
      this.important.val(false);
      return Lungo.Router.section("task");
    };

    TaskCtrl.prototype._show = function(current) {
      this.current = current;
      this.name.val(this.current.name);
      this.description.val(this.current.description);
      this.list.val(this.current.list);
      this.when.val(this.current.when);
      this.important.val(this.current.important);
      return Lungo.Router.section("task");
    };

    return TaskCtrl;

  })(Monocle.Controller);

  $$(function() {
    return __Controller.Task = new TaskCtrl("section#task");
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  __Controller.TasksCtrl = (function(_super) {
    __extends(TasksCtrl, _super);

    TasksCtrl.prototype.events = {
      "click [data-action=new]": "onNew"
    };

    TasksCtrl.prototype.elements = {
      "#pending": "pending",
      "#important": "important",
      "input": "name"
    };

    function TasksCtrl() {
      this.bindTaskUpdated = __bind(this.bindTaskUpdated, this);
      this.bindTaskCreated = __bind(this.bindTaskCreated, this);
      TasksCtrl.__super__.constructor.apply(this, arguments);
      __Model.Task.bind("create", this.bindTaskCreated);
      __Model.Task.bind("destroy", this.updateImportantCount);
      __Model.Task.bind("update", this.bindTaskUpdated);
    }

    TasksCtrl.prototype.onNew = function(event) {
      return __Controller.Task["new"]();
    };

    TasksCtrl.prototype.bindTaskCreated = function(task) {
      var context;
      console.log(1);
      context = task.important === true ? "high" : "normal";
      new __View.Task({
        model: task,
        container: "article#" + context + " ul"
      });
      Lungo.Router.back();
      Lungo.Notification.hide();
      return this.updateImportantCount();
    };

    TasksCtrl.prototype.bindTaskUpdated = function(task) {
      Lungo.Router.back();
      Lungo.Notification.hide();
      return this.updateImportantCount();
    };

    TasksCtrl.prototype.updateImportantCount = function() {
      console.log(__Model.Task.counter());
      Lungo.Element.count("#important", __Model.Task.counter().length);
      return Lungo.Element.count("#importantnav", __Model.Task.counter().length);
    };

    return TasksCtrl;

  })(Monocle.Controller);

  $$(function() {
    var Tasks;
    Lungo.init({});
    Tasks = new __Controller.TasksCtrl("section#tasks");
    return Tasks.updateImportantCount();
  });

}).call(this);
