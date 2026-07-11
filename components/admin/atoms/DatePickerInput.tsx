"use client";
import React, { forwardRef, useState } from "react";
import DatePicker, {
	CalendarContainer,
	ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/components/custom-date-picker.scss";
import { Drawer } from "antd";
import PopupHeaderMobile from "@/components/general/molecules/PopupHeaderMobile";
import { useMediaQuery } from "react-responsive";
import { formatDate } from "@/utils/formatDate";
import { Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface Props {
	control: any;
	name: string;
	label?: string;
	errors: any;
	required?: boolean;
}

const DatePickerInput: React.FC<Props> = ({ control, name, label, errors, required }) => {
	const [currentDate, setCurrentDate] = useState<Date | null>(null);
	const [open, setOpen] = useState(false);
	const [openMobleCalendar, setOpenMobleCalendar] = useState<boolean>(false);
	const windowWidth = typeof window !== "undefined" ? window?.innerWidth : 430;
	const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

	const MyContainer: React.FC<{ className: string; children: React.ReactNode }> = ({
		className,
		children,
	}) => (
		<div
			className={"p-4 bg-white rounded-sgt-10 " + (isMobile ? "px-5" : "")}
			style={!isMobile ? { boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)" } : {}}
		>
			<CalendarContainer className={`${className} !border-none custom-date-picker w-full`}>
				{children}
			</CalendarContainer>
		</div>
	);

	const renderCustomHeader = ({ date, decreaseMonth, increaseMonth }: ReactDatePickerCustomHeaderProps) => (
		<div className="mb-1.5 text-sgt-neutral-1">
			<div
				className={`flex items-center justify-between px-5 ${isMobile ? "mb-5 py-3" : "mb-4 py-2.5"} bg-sgt-primary-2 rounded`}
			>
				<div
					className="bg-sgt-neutral-1 w-6 h-6 cursor-pointer"
					onClick={decreaseMonth}
					style={{ mask: 'url("/assets/icons/chevron-left.svg")', maskSize: "cover" }}
				/>
				<span className="text-sub-1 font-medium">{`Tháng ${date.getMonth() + 1}/${date.getFullYear()}`}</span>
				<div
					className="bg-sgt-neutral-1 w-6 h-6 cursor-pointer"
					onClick={increaseMonth}
					style={{ mask: 'url("/assets/icons/chevron-right.svg")', maskSize: "cover" }}
				/>
			</div>
			<div className="grid grid-cols-7 text-center">
				{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
					<span key={index} className={`text-button font-medium ${index >= 5 ? "text-sgt-third-2" : ""}`}>
						{day}
					</span>
				))}
			</div>
		</div>
	);

	const dayClassName = (date: Date, selectedDate: Date | null) => {
		const isWeekend = date.getDay() === 0 || date.getDay() === 6;
		const today = new Date();
		const check = currentDate || selectedDate || today;
		const isInCurrentMonth = date.getMonth() === check?.getMonth() && date.getFullYear() === check?.getFullYear();
		const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
		const isToday = date.toDateString() === today.toDateString();
		const isPast = date < new Date(today.setHours(0, 0, 0, 0));

		return `!flex-1 !flex aspect-1/1 !text-body-2 !text-sgt-neutral-1 !rounded-md !items-center justify-center !leading-none !m-1 md:!m-0.5 !select-none
			${isPast ? "hover:!bg-transparent !cursor-not-allowed " : "hover:!bg-sgt-primary-3 "}
			${isSelected ? "!bg-sgt-primary-2" : ""}
			${isWeekend ? "!text-sgt-third-2" : ""}
			${!isInCurrentMonth ? (isWeekend ? "!text-[#FF3F15] opacity-30" : "!text-[#A7A7A7] opacity-50") : ""}
			${(isToday && !isSelected) ? "ring-1 ring-sgt-primary-2" : ""}`;
	};

	const CustomInput = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
		({ }, ref) => {
			const [isHovered, setIsHovered] = useState(false);
			return (
				<button
					ref={ref}
					type="button"
					className={`${open ? "border-sgt-primary-1" : "border-sgt-neutral-4"} 
						mt-1 font-medium text-sm lg:text-base rounded-md !w-full py-1.5 px-3 border
						relative flex justify-between items-center`}
					onClick={!isMobile ? () => setOpen(!open) : () => setOpenMobleCalendar(true)}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<Controller
						control={control}
						name={name}
						render={({ field }) => (
							<div className="flex justify-between w-full">
								<p>
									{field.value ? (
										formatDate(field.value)
									) : (
										<span className="text-sgt-neutral-3 font-normal text-xs lg:text-sm">
											Chọn ngày
										</span>
									)}
								</p>

								{(isHovered || isMobile) && field.value && (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											field.onChange(null);
										}}
										className="ml-2 text-gray-400 hover:text-gray-600 transition -mr-2 px-2"
									>
										<FontAwesomeIcon icon={faX} />
									</button>
								)}
							</div>
						)}
					/>
				</button>
			);
		}
	);
	CustomInput.displayName = "CustomInput";

	const onChangeDate = (date: any, field: any) => {
		if (!date || date < new Date(new Date().setHours(0, 0, 0, 0))) return;
		field.onChange(date);
		setCurrentDate(date);
		setOpen(false);
		setOpenMobleCalendar(false);
	}

	return (
		<>
			<Controller
				control={control}
				name={name}
				rules={{ required: required ? 'Vui lòng chọn ngày' : false }}
				render={({ field }) => {
					return (
						<div className="custom-input">
							{label && <label className="font-medium text-sm lg:text-base text-sgt-neutral-1">{label}:</label>}
							<DatePicker
								selected={field.value}
								onChange={(date: any) => onChangeDate(date, field)}
								onMonthChange={setCurrentDate}
								calendarContainer={MyContainer}
								renderCustomHeader={renderCustomHeader}
								dayClassName={(date) => dayClassName(date, field.value)}
								calendarStartDay={1}
								open={open}
								inline={false}
								onClickOutside={() => setTimeout(() => setOpen(false), 100)}
								showPopperArrow={false}
								popperPlacement="bottom-end"
								customInput={<CustomInput />}
							/>

							<Drawer
								title=""
								open={openMobleCalendar}
								width={"100%"}
								height={windowWidth < 615 ? windowWidth + 120 : 700}
								footer={null}
								closeIcon={null}
								className="sgt_drawer sgt_drawer_search_filter_mobile"
								styles={{ wrapper: { boxShadow: "none" } }}
								placement="bottom"
								destroyOnHidden
								zIndex={9999}
								onClose={() => setOpenMobleCalendar(false)}
							>
								<PopupHeaderMobile title="Chọn ngày" close={() => setOpenMobleCalendar(false)} showDivider={true} />
								<DatePicker
									selected={field.value}
									onChange={(date: any) => onChangeDate(date, field)}
									onMonthChange={setCurrentDate}
									inline={true}
									calendarContainer={MyContainer}
									renderCustomHeader={renderCustomHeader}
									dayClassName={(date) => dayClassName(date, field.value)}
									calendarStartDay={1}
								/>
							</Drawer>
						</div>
					);
				}}
			/>
			{errors[name] && <p className="text-xs -mb-1 lg:text-sm text-red-500">{errors[name]?.message as string}</p>}
		</>

	);
};

export default DatePickerInput;
