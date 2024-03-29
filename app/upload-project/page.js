import React from "react";

const UploadProject = () => {
  return (
    <div className="flex justify-center">
      {/* UploadProject */}
      <form className="justify-start flex flex-col gap-5 mt-10 w-auto rounded-lg shadow-sm p-5 w-[30rem] bg-zinc-100">
        <span className="justify-start flex flex-col gap-5 w-50 w-[30rem] bg-zinc-100">
          <input
            type="text"
            placeholder="Contract NO:"
            className="input-sm rounded-md max-w-60 text-zinc-600 input-bordered text-sm p-4 bg-zinc-200"
          />

          <textarea
            className="textarea textarea-bordered resize-none text-xs focus:outline-none focus:border-primary focus:border-2"
            placeholder="Project Name:"
          ></textarea>

          <input
            type="text"
            placeholder="Budget for Contract:"
            className="input-sm rounded-md max-w-60 text-zinc-600 input-bordered text-xs p-4 bg-zinc-200"
          />
          <input
            type="text"
            placeholder="Contract Amount:"
            className="input-sm rounded-md max-w-60 text-zinc-600 input-bordered text-xs p-4 bg-zinc-200"
          />
        </span>

        <textarea
          className="textarea textarea-bordered resize-none text-xs focus:outline-none focus:border-primary focus:border-2"
          placeholder="List of Biddders:"
          rows={7}
        ></textarea>
      </form>
    </div>
  );
};

export default UploadProject;
