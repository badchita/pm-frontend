import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QuillModule } from 'ngx-quill';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import Quill from 'quill';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RequiredValidator } from '@app/shared/constants/validators';
import { TaskService } from '../../services/task.service';
import { SPINNER_TIP } from '@app/shared/constants/ui.constants';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ErrorAlertComponent } from '@app/shared/components/error-alert/error-alert.component';
import { TaskComment } from '../../models/task-comment.model';
import { formatDistance } from 'date-fns';
import { TaskCommentReactionType } from '@app/shared/enums/task-comment-reaction.enum';
import { TaskCommentReaction } from '../../models/task-comment-reaction-model';
import { User } from '@app/features/auth/models/user.model';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-task-form-details',
  imports: [
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    QuillModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzCommentModule,
    NzAvatarModule,
    NzCardModule,
    NzSpinModule,
    FormsModule,
    ErrorAlertComponent,
    NzTooltipModule,
  ],
  templateUrl: './task-form-details.component.html',
  styleUrl: './task-form-details.component.scss',
})
export class TaskFormDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('descriptionRef') descriptionRef!: any;
  @ViewChild('acceptanceCriteriaRef') acceptanceCriteriaRef!: any;
  @ViewChild('discussionsRef') discussionsRef!: ElementRef;

  taskDetailForm = input.required<FormGroup>();
  taskId = input.required<number>();
  onGetTotalComments = output<number | null>();

  private readonly taskService = inject(TaskService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);

  private readonly _destroying$ = new Subject<void>();

  clearToolbarTimer: any;
  commentsSpinnerTip!: string;
  createTaskCommentForm!: FormGroup;
  catchError!: any;
  taskComments: TaskComment[] = [];
  taskCommentsReactions: TaskCommentReaction[] = [];
  reactionLikeUsers: User[] = [];
  reactionDislikeUsers: User[] = [];
  userDetails!: User;

  quillToolbar = [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
  ];
  descriptionQuillmodules = {
    toolbar: this.quillToolbar,
  };
  acceptanceCriteriaQuillmodules = {
    toolbar: this.quillToolbar,
  };
  descriptionTheme = 'bubble';
  acceptanceCriteriaTheme = 'bubble';
  showDescriptionRichText = true;
  showAcceptanceCriteriaRichText = true;
  hideDescriptionRichText = false;
  hideDescription = false;
  hideacceptanceCriteriaRichText = false;
  hideacceptanceCriteria = false;
  hideOtherCol = false;
  hideDiscussionRow = false;
  hideDiscussionCol = false;
  hideDetailsRow = false;
  richTextSpan = 13;
  discussionSpan = 13;
  hoverdInputs = {
    taskPoints: false,
    readyForDevelopmentDate: false,
    doneDate: false,
    testingStartDate: false,
    testingEndDate: false,
  };
  toolbarInteracting = false;
  isCommentsLoading = false;
  SPINNER_TIP = SPINNER_TIP;
  TaskCommentReactionType = TaskCommentReactionType;
  userReactionsByComment = new Map<number, TaskCommentReactionType | null>();

  ngOnInit() {
    if (this.taskId()) {
      this.buildForm();
    } else {
      this.onGetTotalComments.emit(null);
    }
  }

  buildForm() {
    const userDetailsSession = sessionStorage.getItem('user_details');
    this.userDetails = userDetailsSession ? JSON.parse(userDetailsSession) : null;
    this.createTaskCommentForm = this.formBuilder.group({
      id: [null],
      content: [null, RequiredValidator],
      userId: [this.userDetails.id],
    });
    this.loadComments();
  }

  handleInputFocusBlur(input: string, isFocus = false) {
    if (!isFocus && this.toolbarInteracting) return;

    const hoverStateMap: Record<string, keyof typeof this.hoverdInputs> = {
      taskPoints: 'taskPoints',
      readyForDevelopmentDate: 'readyForDevelopmentDate',
      doneDate: 'doneDate',
      testingStartDate: 'testingStartDate',
      testingEndDate: 'testingEndDate',
    };

    if (hoverStateMap[input]) {
      this.hoverdInputs[hoverStateMap[input]] = isFocus;
      return;
    }

    const editorMap: Record<string, { themeProp: 'descriptionTheme' | 'acceptanceCriteriaTheme' }> =
      {
        description: { themeProp: 'descriptionTheme' },
        acceptanceCriteria: { themeProp: 'acceptanceCriteriaTheme' },
      };

    if (editorMap[input]) {
      const themeProp = editorMap[input].themeProp;
      const newTheme = isFocus ? 'snow' : 'bubble';

      if (this[themeProp] === newTheme) return;

      this[themeProp] = newTheme;
      this.reRenderEditor(input, !isFocus);
    }
  }

  onEditorCreated(quill: Quill) {
    const toolbar = quill.getModule('toolbar') as any | null;

    if (!toolbar?.container) return;

    const toolbarEl = toolbar.container;

    toolbarEl.addEventListener('pointerdown', () => {
      this.toolbarInteracting = true;
      if (this.clearToolbarTimer) {
        clearTimeout(this.clearToolbarTimer);
      }
    });

    document.addEventListener('pointerup', () => {
      this.clearToolbarTimer = setTimeout(() => {
        this.toolbarInteracting = false;
      }, 0);
    });
  }

  expandMinimize(richText: string, isExpand: boolean, isDiscussionRow = false) {
    const span = isExpand ? 24 : 13;

    if (isDiscussionRow) {
      this.discussionSpan = span;
      this.hideOtherCol = isExpand;
      this.hideacceptanceCriteria = isExpand;
      this.hideDescription = isExpand;
      return;
    }

    this.richTextSpan = span;
    this.hideOtherCol = isExpand;
    this.hideDiscussionRow = isExpand;

    if (richText === 'description') {
      this.hideacceptanceCriteria = isExpand;
    } else {
      this.hideDescription = isExpand;
    }
  }

  private reRenderEditor(richTextInput: string, isBlur: boolean) {
    if (richTextInput === 'description') {
      this.showDescriptionRichText = false;
      this.changeDetectorRef.detectChanges();
      this.showDescriptionRichText = true;
      setTimeout(() => {
        if (isBlur) {
          this.descriptionRef = null;
          return;
        }
        if (this.descriptionRef) {
          const quill = this.descriptionRef.quillEditor;
          this.acceptanceCriteriaRef = null;
          quill.focus();
        }
      });
      return;
    }

    this.showAcceptanceCriteriaRichText = false;
    this.changeDetectorRef.detectChanges();
    this.showAcceptanceCriteriaRichText = true;
    setTimeout(() => {
      if (isBlur) {
        this.acceptanceCriteriaRef = null;
        return;
      }
      if (this.acceptanceCriteriaRef) {
        const quill = this.acceptanceCriteriaRef.quillEditor;
        quill.focus();
      }
    });
  }

  addComment() {
    this.isCommentsLoading = true;
    this.commentsSpinnerTip = this.SPINNER_TIP.Adding.replace('{{1}}', 'Comment');
    const payload = this.createTaskCommentForm.getRawValue();

    this.taskService
      .saveTaskComment(payload, this.taskId())
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isCommentsLoading = false;
        })
      )
      .subscribe(
        () => {
          this.createTaskCommentForm.get('content')?.reset();
          this.loadComments();
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  loadComments() {
    this.isCommentsLoading = true;

    this.taskService
      .getAllTaskComments(this.taskId())
      .pipe(
        takeUntil(this._destroying$),
        finalize(() => {
          this.isCommentsLoading = false;
        })
      )
      .subscribe(
        (comments) => {
          this.onGetTotalComments.emit(comments.length);
          this.taskComments = comments.map((comment) => {
            if (comment.reactions?.length) {
              this.taskCommentsReactions = comment.reactions ?? [];

              this.buildUserReactionMap();

              this.reactionLikeUsers = comment.reactions
                .filter((r) => r.user && r.reactionType === this.TaskCommentReactionType.Like)
                .map((r) => r.user!);

              this.reactionDislikeUsers = comment.reactions
                .filter((r) => r.user && r.reactionType === this.TaskCommentReactionType.Dislike)
                .map((r) => r.user!);
            }

            const likeReactions = comment.reactions?.filter(
              (reaction) => reaction.reactionType === this.TaskCommentReactionType.Like
            );

            const disLikeReactions = comment.reactions?.filter(
              (reaction) => reaction.reactionType === this.TaskCommentReactionType.Dislike
            );

            return {
              ...comment,
              displayTime: formatDistance(new Date(comment.createdAt + 'Z'), new Date(), {
                addSuffix: true,
              }),
              totalLikeReaction: likeReactions?.length,
              totalDislikeReaction: disLikeReactions?.length,
            };
          });
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  likeDislike(reaction: TaskCommentReactionType, taskCommentId: number) {
    const userId = this.userDetails.id;
    const userReaction = this.taskCommentsReactions.find((reaction) => reaction.userId === userId);
    const payload: TaskCommentReaction = {
      taskCommentId: taskCommentId,
      userId: userId,
      reactionType: userReaction?.reactionType === reaction ? null : reaction,
    };

    if (userReaction?.id != null) {
      payload.id = userReaction.id;
    }

    this.taskService
      .updateTaskCommentReaction(payload, this.taskId(), taskCommentId)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        () => {
          this.loadComments();
        },
        (error) => {
          this.catchError = error;
        }
      );
  }

  hasUserReacted(taskCommentId: number, reactionType: TaskCommentReactionType): boolean {
    return this.userReactionsByComment.get(taskCommentId) === reactionType;
  }

  scrollToDiscussions() {
    if (this.discussionsRef) {
      this.discussionsRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private buildUserReactionMap(): void {
    this.userReactionsByComment.clear();

    const userId = this.userDetails.id;

    for (const reaction of this.taskCommentsReactions) {
      if (reaction.userId === userId) {
        this.userReactionsByComment.set(reaction.taskCommentId, reaction.reactionType);
      }
    }
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
