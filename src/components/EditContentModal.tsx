import { useFieldArray, useForm } from "react-hook-form";
import Button from "./ui/Button";
import { useUpdateContentMutation } from "../queries/content/useUpdateContentMutation";
import { useEffect } from "react";
import { FieldErrors } from "./ui/FieldErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContentSchema } from "../validators/Content.schema";
import AddIcon from "./icons/AddIcon";
import TagIcon from "./icons/TagIcon";
import LinkIcon from "./icons/LinkIcon";
import TitleIcon from "./icons/TitleIcon";
import CrossIcon from "./icons/CrossIcon";
import CrossXsIcon from "./icons/CrossXsIcon";
import { useModalActions, useModalState } from "../store/AppStore";
import { useCreateContentMutation } from "../queries/content/useCreateContentMutation";
import type { ModalData } from "../store/slices/modal.slice";
import ShareIcon from "./icons/ShareIcon";
import ToggleSwitch from "./ui/ToggleSwitch";
import { useQueryClient } from "@tanstack/react-query";

const ContentModal = () => {
   const queryClient = useQueryClient();
   const { modalData: content, modalType } = useModalState();
   const { setModalData, setModalType } = useModalActions();
   const createContentMutation = useCreateContentMutation();
   const updateContentMutation = useUpdateContentMutation();

   const onClose = () => {
      setModalData(null);
      setModalType(null);
      queryClient.invalidateQueries({
         queryKey: ["brain", "piece", "status", content?._id],
      });
   };

   const {
      handleSubmit,
      register,
      control,
      reset,
      setValue,
      setFocus,
      watch,
      formState,
      getFieldState,
   } = useForm<ModalData>({
      defaultValues: {
         title: content?.title,
         link: content?.link,
         tags: content?.tags ?? [],
         newTag: "",
         isActive: content?.isActive ?? false,
      },
      resolver: zodResolver(ContentSchema),
      mode: "onBlur",
      reValidateMode: "onBlur",
   });

   const { fields, append, remove } = useFieldArray({ control, name: "tags" });

   useEffect(() => {
      reset({
         title: content?.title,
         link: content?.link,
         tags: content?.tags ?? [],
         newTag: "",
         isActive: content?.isActive ?? false,
      });
   }, [content, reset]);

   const newTag = watch("newTag");
   const isActive = watch("isActive");

   const onSubmit = async (data: ModalData) => {
      const payload = {
         title: data.title,
         link: data.link,
         tags: data?.tags?.map((d) => d.name),
         isActive: data.isActive,
      };
      if (modalType === "update" && content?._id) {
         await updateContentMutation.mutateAsync({
            content: payload,
            contentId: content._id,
         });
         onClose();
         return;
      }
      if (modalType === "create") {
         await createContentMutation.mutateAsync(payload);
         onClose();
         return;
      }
   };

   const handleAddTag = () => {
      if (!newTag?.trim()) return;
      append({ name: newTag.trim() });
      setValue("newTag", "");
      setTimeout(() => setFocus("newTag"), 0);
   };

   const inputClass =
      "w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10";

   return (
      <div
         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
         onClick={onClose}
      >
         <div
            className="w-full sm:max-w-2xl animate-in sm:zoom-in-95 slide-in-from-bottom sm:slide-in-from-bottom-0 duration-200"
            onClick={(e) => e.stopPropagation()}
         >
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="w-full rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 overflow-hidden
                          max-h-[92dvh] sm:max-h-[90dvh] flex flex-col"
            >
               {/* Header */}
               <div className="shrink-0 relative px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-zinc-800 bg-linear-to-r from-indigo-50 via-white to-indigo-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                     <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                           {modalType === "create"
                              ? "Add Content"
                              : "Edit Content"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                           {modalType === "create"
                              ? "Save a new link to your Brain"
                              : "Update your content details and tags"}
                        </p>
                     </div>
                     <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
                        aria-label="Close modal"
                     >
                        <CrossIcon />
                     </button>
                  </div>
               </div>

               {/* Scrollable Body */}
               <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-4 space-y-5">
                  {/* Title Field */}
                  <div className="space-y-2">
                     <label
                        htmlFor="title"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                     >
                        <TitleIcon />
                        Title
                     </label>
                     <input
                        {...register("title")}
                        id="title"
                        className={inputClass}
                        placeholder="Enter a descriptive title..."
                     />
                     <FieldErrors
                        formState={formState}
                        getFieldState={getFieldState}
                        name="title"
                     />
                  </div>

                  {/* Link Field */}
                  <div className="space-y-2">
                     <label
                        htmlFor="link"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                     >
                        <LinkIcon />
                        Link
                     </label>
                     <input
                        {...register("link")}
                        id="link"
                        type="url"
                        className={inputClass}
                        placeholder="https://example.com"
                     />
                     <FieldErrors
                        formState={formState}
                        getFieldState={getFieldState}
                        name="link"
                     />
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-3">
                     <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <TagIcon />
                        Tags
                     </label>

                     {/* Add Tag Input */}
                     <div className="flex gap-2">
                        <input
                           {...register("newTag")}
                           className="flex-1 min-w-0 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 dark:focus:bg-zinc-900 dark:focus:ring-indigo-400/10"
                           placeholder="Type a tag and press Enter..."
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 handleAddTag();
                              }
                           }}
                        />
                        <Button
                           size="md"
                           variant="secondary"
                           onClick={handleAddTag}
                           type="button"
                           className="shrink-0"
                           startIcon={<AddIcon />}
                        >
                           Add
                        </Button>
                     </div>

                     {/* Tags Display */}
                     {fields.length > 0 ? (
                        <div className="flex flex-wrap gap-2 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-2 border-dashed border-gray-200 dark:border-zinc-700 min-h-14">
                           {fields.map((field, index) => (
                              <div
                                 key={field.id}
                                 className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-indigo-600 px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm font-medium text-white shadow-md ring-1 ring-indigo-400/20 transition-all hover:shadow-lg dark:from-indigo-600 dark:to-indigo-700"
                              >
                                 <span className="text-indigo-100">#</span>
                                 <input
                                    {...register(`tags.${index}.name` as const)}
                                    className="min-w-10 max-w-24 sm:max-w-32 bg-transparent outline-none placeholder:text-indigo-200 text-sm"
                                    placeholder="tag"
                                    autoFocus={false}
                                 />
                                 <button
                                    type="button"
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-red-500 hover:rotate-90 active:scale-95"
                                    onClick={() => remove(index)}
                                    aria-label="Remove tag"
                                 >
                                    <CrossXsIcon />
                                 </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="p-6 sm:p-8 text-center rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-2 border-dashed border-gray-200 dark:border-zinc-700">
                           <TagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                              No tags yet. Add tags to organize your content!
                           </p>
                        </div>
                     )}

                     <FieldErrors
                        formState={formState}
                        getFieldState={getFieldState}
                        name="tags"
                     />
                  </div>

                  {/* Sharing Toggle */}
                  <div className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 p-4 sm:p-5">
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-1">
                              <ShareIcon className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                 Enable Sharing
                              </label>
                           </div>
                           <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                              {modalType === "create"
                                 ? "Allow others to access this content via a shareable link"
                                 : "Toggle to enable or disable public access to this content"}
                           </p>
                           {isActive && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-xs font-medium text-green-700 dark:text-green-400">
                                 <svg
                                    className="h-3.5 w-3.5 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 Sharing enabled
                              </div>
                           )}
                        </div>
                        <ToggleSwitch
                           isOn={isActive ?? false}
                           onToggle={(value) => setValue("isActive", value)}
                           disabled={formState.isSubmitting}
                        />
                     </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 px-4 sm:px-6 py-3 sm:py-4">
                  <Button
                     size="lg"
                     type="button"
                     variant="ghost"
                     onClick={onClose}
                     className="w-full sm:w-auto"
                  >
                     Cancel
                  </Button>
                  <Button
                     size="lg"
                     variant="primary"
                     loading={formState.isSubmitting}
                     className="w-full sm:w-auto"
                  >
                     {formState.isSubmitting
                        ? "Saving..."
                        : modalType === "create"
                          ? "Add Content"
                          : "Save Changes"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default ContentModal;
